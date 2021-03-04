<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Bonk\interfaces\ClientFactory;
use Bonk\interfaces\Request;
$req = Request::fromSession();
$client = ClientFactory::fromRequest($req);
header('Content-Type: application/json');
echo json_encode((object)array("data"=>$client->getTanMedia($req->data->tanMode),"state"=>$client->persist()));
