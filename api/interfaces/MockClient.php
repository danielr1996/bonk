<?php

namespace Bonk\interfaces;

require_once __DIR__ . '/../../vendor/autoload.php';


class MockClient implements Client
{
    private function __construct()
    {
    }

    public static function create(string $url, string $blz, string $user, string $pin)
    {
        return new MockClient();
    }

    public function getTanModes()
    {
        return array(
            (object)(array(
                "sicherheitsfunktion" => 902,
                "tanProzess" => "2",
                "nameDesZweiSchrittVerfahrens" => "photoTAN-Verfahren",
                "tanMediaRequired" => false,
            )),
            (object)(array(
                "sicherheitsfunktion" => 901,
                "tanProzess" => "2",
                "nameDesZweiSchrittVerfahrens" => "mobileTAN-Verfahren",
                "tanMediaRequired" => true,
            )));
    }

    public function getTanMedia(int $tanMode)
    {
        return array($tanMode.'TanDevice');
    }

    public function getAccounts(int $tanMode, string $tanMedia)
    {
        throw new TanRequiredException();
    }

    public function getStatements(int $tanMode, string $tanMedia, mixed $account)
    {
        if(!key_exists('HTTP_AUTHORIZATION',$_SERVER)){
            throw new TanRequiredException();
        }
        $tan = str_replace('Tan ', '',$_SERVER['HTTP_AUTHORIZATION']);
        return array('statements');
    }

    public function resume()
    {
        return 'result';
    }

    public function persist(): string
    {
        return base64_encode("persisted");
    }
}
