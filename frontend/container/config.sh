#!/bin/bash
config=$1
rm -rf $config
touch $config
echo "window._env_ = {" >> $config
source .env
env | grep "^APP_" | while read line;
do
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi
  echo "  $varname: \"$varvalue\"," >> $config
done

echo "}" >> $config
