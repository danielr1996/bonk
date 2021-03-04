<?php

namespace Bonk\interfaces;

class ClientFactory
{
    public static function fromRequest(Request $req): Client
    {
        $options = $req->options;
        if (array_key_exists('mock', $_REQUEST) && $_REQUEST['mock'] === "true") {
            return MockClient::create($options->url, $options->blz, $options->user, $options->pin);
        } else {
            if(empty($req->state)){
                return FinTSClient::create($options->url, $options->blz, $options->user, $options->pin);
            }else{
                return FinTSClient::fromState($req->state,$options->url, $options->blz, $options->user, $options->pin);
            }
        }
    }
}
