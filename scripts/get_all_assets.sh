export SCRIPTS_ROOT=/root/encrypto/scripts
source $SCRIPTS_ROOT/p0o1.sh

peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'