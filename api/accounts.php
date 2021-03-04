<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Bonk\interfaces\ClientFactory;
use Bonk\interfaces\Request;
$req = Request::fromSession();
$client = ClientFactory::fromRequest($req);
try{
    header('Content-Type: application/json');
    echo json_encode((object)array("data"=>$client->getAccounts($req->data->tanMode, $req->data->tanMedia),"state"=>$client->persist()));
}catch (\Bonk\interfaces\TanRequiredException $e){
    header('WWW-Authenticate: Please resend the request with the Tan in the Authentication Header and the state');
    http_response_code(401);
}
