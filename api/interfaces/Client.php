<?php
namespace Bonk\interfaces;

interface Client
{
    public function getTanModes();
    public function getTanMedia(int $tanMode);
    public function getAccounts(int $tanMode, string $tanMedia);
    public function getStatements(int $tanMode, string $tanMedia, mixed $account);
    public function resume();
    public static function create(string $url, string $blz, string $user, string $pin);
    public function persist($action): string;
}
