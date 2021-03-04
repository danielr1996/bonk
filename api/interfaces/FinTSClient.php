<?php

namespace Bonk\interfaces;
require_once __DIR__ . '/../../vendor/autoload.php';

use DateTime;
use Fhp\Action\GetSEPAAccounts;
use Fhp\Action\GetStatementOfAccount;
use Fhp\CurlException;
use Fhp\FinTs;
use Fhp\Model\SEPAAccount;
use Fhp\Options\Credentials;
use Fhp\Options\FinTsOptions;
use Fhp\Protocol\ServerException;


class FinTSClient implements Client
{
    private FinTs $client;

    private function __construct(
        public string $url,
        public string $blz,
        public int $user,
        public string $pin,
    )
    {
        $options = new FinTsOptions();
        $options->url = $url;
        $options->bankCode = $blz;
        $options->productName = '9FA6681DEC0CF3046BFC2F8A6';
        $options->productVersion = '1.0';

        $credentials = Credentials::create($user, $pin);
        $this->client = FinTs::new($options, $credentials);
    }

    public static function create(string $url, string $blz, string $user, string $pin)
    {
        return new FinTSClient($url, $blz, $user, $pin);
    }

    public static function fromState(string $state, string $url, string $blz, string $user, string $pin): FinTSClient
    {
        $options = new FinTsOptions();
        $options->url = $url;
        $options->bankCode = $blz;
        $options->productName = '9FA6681DEC0CF3046BFC2F8A6';
        $options->productVersion = '1.0';
        $credentials = Credentials::create($user, $pin);
        $client = FinTSClient::create($url, $blz, $user, $pin);
        $client->client = FinTs::new($options, $credentials, base64_decode($state));
        return $client;
    }

    public function getTanModes()
    {
        return array_map(function ($tanMode) {
            $tanMode->needsTanMedium = $tanMode->needsTanMedium();
            return $tanMode;
        }, array_values($this->client->getTanModes()));
    }

    public function getTanMedia(int $tanMode)
    {
        try {
            return $this->client->getTanMedia($tanMode);
        } catch (\InvalidArgumentException $e) {
            if (str_contains($e->getMessage(), "tanMedium not allowed for this tanMode")) {
                return array();
            }
            throw $e;
        }
    }

    public function getAccounts(int $tanMode, string $tanMedia)
    {
        if (array_filter($this->client->getTanModes(), function ($tm) use ($tanMode) {
            return $tm->getId() === $tanMode;
        })[$tanMode]->needsTanMedium()) {
            $this->client->selectTanMode($tanMode, $tanMedia);
        } else {
            $this->client->selectTanMode($tanMode);
        }
        $login = $this->client->login();
        if ($login->needsTan()) {
            return "Login needs tan";
        }
        $get_sepa_accounts = GetSEPAAccounts::create();
        if ($get_sepa_accounts->needsTan()) {
            return "get_sepa_account needs tan";
        }
        $this->client->execute($get_sepa_accounts);
        return array_map(function ($acc) {
            return (object)array(
                "iban" => $acc->getIban(),
                "bic" => $acc->getBic(),
                "blz" => $acc->getBlz(),
                "accountNumber" => $acc->getAccountNumber(),
                "subAccount" => $acc->getSubAccount(),
            );
        }, $get_sepa_accounts->getAccounts());
    }

    public function getStatements(int $tanMode, string $tanMedia, mixed $account)
    {
        if (array_filter($this->client->getTanModes(), function ($tm) use ($tanMode) {
            return $tm->getId() === $tanMode;
        })[$tanMode]->needsTanMedium()) {
            $this->client->selectTanMode($tanMode, $tanMedia);
        } else {
            $this->client->selectTanMode($tanMode);
        }
        $login = $this->client->login();
        if ($login->needsTan()) {
            return "Login needs tan";
        }
//        print_r($this->client->getSelectedTanMode());
        $sepaAccount = new SEPAAccount();
        $sepaAccount->setBic($account->bic);
        $sepaAccount->setIban($account->iban);
        $sepaAccount->setAccountNumber($account->accountNumber);
        $sepaAccount->setBlz($account->blz);

        $from = new DateTime('2021-02-01');
        $to = new DateTime();
        $getStatement = GetStatementOfAccount::create($sepaAccount, $from, $to);
        $this->client->execute($getStatement);
        if ($getStatement->needsTan()) {
//            if(!key_exists('HTTP_AUTHORIZATION',$_SERVER)){
//                throw new TanRequiredException();
//            }
//            $tan = str_replace('Tan ', '',$_SERVER['HTTP_AUTHORIZATION']);
//            $
//            $this->client->submitTan($getStatement, trim(fgets(STDIN)));
        }
        $transactions = array();
        foreach ($getStatement->getStatement()->getStatements() as $statement) {
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
        return (object)array(
            "transactions"=>$transactions,
            "action"=>$getStatement,
        );
    }

    public function resume()
    {
        return 'result';
    }

    public function persist($action): string
    {
        return base64_encode(serialize((object)array("client"=>$this->client->persist(), "action"=>$action->needsTan() ? serialize($action) : '')));
    }
}
