<?php

namespace Bonk\interfaces;
require_once __DIR__ . '/../../vendor/autoload.php';

class Options
{
    public function __construct(
        public string $url,
        public string $blz,
        public string $user,
        public string $pin,
    )
    {
    }

    public static function from($opts): Options
    {
        return new Options($opts->url, $opts->blz, $opts->user, $opts->pin);
    }
}

class Request
{
    private function __construct(
        public string $state,
        public Options $options,
        public $data,
    )
    {
    }

    public static function from($req): Request
    {
        if($req->state){
            $unser = unserialize($req->state);
            $client = $unser->client;
            $action = $unser->action;
            print_r($unser);
            print_r($action);
            return new Request('',Options::from($req->options), $req->data);
        }
        return new Request('',Options::from($req->options), $req->data);
    }

    public static function fromSession(): Request
    {
        return self::from(json_decode(file_get_contents('php://input')));
    }
}
