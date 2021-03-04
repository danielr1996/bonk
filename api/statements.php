<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Bonk\interfaces\ClientFactory;
use Bonk\interfaces\Request;
use Fhp\Action\GetSEPAAccounts;
use Fhp\Action\GetStatementOfAccount;
use Fhp\FinTs;
use Fhp\Model\SEPAAccount;
use Fhp\Options\Credentials;
use Fhp\Options\FinTsOptions;

//$req = Request::fromSession();
//$client = ClientFactory::fromRequest($req);
//try{
//    header('Content-Type: application/json');
//    $statements = $client->getStatements($req->data->tanMode, $req->data->tanMedia, $req->data->account);
//    $transactions = $statements->transactions;
//    echo json_encode((object)array("data"=>$transactions,"state"=>$client->persist($statements->action)));
//}catch (\Bonk\interfaces\TanRequiredException $e){
//    header('WWW-Authenticate: Please resend the request with the Tan in the Authentication Header and the state');
//    http_response_code(401);
//    echo json_encode((object)array("state"=>$client->persist()));
//}
$req = json_decode(file_get_contents('php://input'));

$credentials = Credentials::create($req->options->user, $req->options->pin);
$options = new FinTsOptions();
$options->url = $req->options->url;
$options->bankCode = $req->options->blz;
$options->productName = '9FA6681DEC0CF3046BFC2F8A6';
$options->productVersion = '1.0';
if(key_exists('HTTP_AUTHORIZATION',$_SERVER)){//If the request contains a tan create the client from the state
    $restoredState = base64_decode($_SERVER['HTTP_AUTHORIZATION']);
    list($persistedInstance, $persistedAction) = unserialize($restoredState);
    $getStatementAction = unserialize($persistedAction);
    $client = FinTs::new($options, $credentials, $persistedInstance);
    $client->submitTan($getStatementAction, $_SERVER['HTTP_AUTHORIZATION_TAN']);
}else{
    $client = FinTs::new($options, $credentials);
    $tanMode = $req->data->tanMode;
    $tanMedia = $req->data->tanMedia;
    $tanModeObj = $client->getTanModes()[$tanMode];
    if ($tanModeObj->needsTanMedium()) {
        $client->selectTanMode($tanMode, $tanMedia);
    } else {
        $client->selectTanMode($tanMode);
    }
    $login = $client->login();
    if ($login->needsTan()) {
        throw new Exception("TAN required for login");
    }
    $sepaAccount = new SEPAAccount();
    $sepaAccount->setBic($req->data->account->bic);
    $sepaAccount->setIban($req->data->account->iban);
    $sepaAccount->setAccountNumber($req->data->account->accountNumber);
    $sepaAccount->setBlz($req->data->account->blz);
    $from = new DateTime('2021-02-01');
    $to = new DateTime();
    $getStatementAction = \Fhp\Action\GetStatementOfAccount::create($sepaAccount, $from, $to);
    $client->execute($getStatementAction);
    if ($getStatementAction->needsTan()) {
        header('Content-Type: application/json');
        header('WWW-Authenticate: '.$getStatementAction->getTanRequest()->getChallenge());
        http_response_code(401);
        $persistedAction = serialize($getStatementAction);
        $persistedFints = $client->persist();;
        echo json_encode((object)array(
            "state"=>base64_encode(serialize([$persistedFints, $persistedAction])),
        ));
        die();
    }
}

header('Content-Type: application/json');
$transactions = array();
foreach ($getStatementAction->getStatement()->getStatements() as $statement) {
    foreach ($statement->getTransactions() as $transaction) {
        $transactions[] = (object)array(
            "amount" => \Fhp\Model\StatementOfAccount\Transaction::CD_DEBIT ? -1 * $transaction->getAmount() : $transaction->getAmount(),
            "text" => $transaction->getBookingText(),
            "name" => $transaction->getName(),
            "description" => $transaction->getMainDescription(),
            "date" => $transaction->getValutaDate(),
            "pn" => $transaction->getPN(),
        );
    }
}
echo json_encode((object)array(
    "transactions"=>$transactions
));
