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
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
}else{
    $req = json_decode(file_get_contents('php://input'));

    $credentials = Credentials::create($req->options->user, $req->options->pin);
    $options = new FinTsOptions();
    $options->url = $req->options->url;
    $options->bankCode = $req->options->blz;
    $options->productName = '9FA6681DEC0CF3046BFC2F8A6';
    $options->productVersion = '1.0';

    $client = FinTs::new($options, $credentials);
    $tanModes = array_map(function ($tanMode) {
        $tanMode->needsTanMedium = $tanMode->needsTanMedium();
        return $tanMode;
    }, array_values($client->getTanModes()));

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    echo json_encode($tanModes);
}
