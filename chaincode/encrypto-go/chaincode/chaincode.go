package chaincode

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

const (
	Raw int = iota
	Encrypted
	Hash
)

const (
	Pending int = iota
	Approved
	Rejected
)

type Request struct {
	ID 		   string `json:"ID"`
	AssetID    string `json:"assetID"`
	Sender	 string `json:"sender"`
	Owner   string `json:"owner"`
	Privatekey string `json:"privatekey"`
	Key 	 string `json:"key"`
	Status  int `json:"status"` // 0 stands for pending, 1 stands for approved, 2 stands for rejected
}

type Asset struct {
	ID             string `json:"ID"`
	DataType       int    `json:"datatype"` // 0 stand for raw, 1 stands for encrypted, 2 stands for hash
	Owner          string `json:"owner"`
	Value 		   string `json:"value"`  // csv string or hash string
}

func (s *SmartContract) PutData(ctx contractapi.TransactionContextInterface, id string, datatype int, v string) error {
	
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
	  return err
	}
	if exists {
	  return fmt.Errorf("the asset %s already exists", id)
	}
	owner, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}

	asset := Asset{
		ID: id,
		DataType: datatype,
		Owner: owner,
		Value: v,
	}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(asset.ID, assetJSON)
	
}

func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	  return false, fmt.Errorf("failed to read from world state: %v", err)
	}
  
	return assetJSON != nil, nil
  }

// query the data. this function should not commit to the ledger
func (s *SmartContract) GetAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	  return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
	  return nil, fmt.Errorf("the asset %s does not exist", id)
	}
  
	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
	  return nil, err
	}
  
	return &asset, nil
}


func (s *SmartContract) GetRequest(ctx contractapi.TransactionContextInterface, id string) (*Request, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
	  return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
	  return nil, fmt.Errorf("the asset %s does not exist", id)
	}
  
	var rq Request
	err = json.Unmarshal(assetJSON, &rq)
	if err != nil {
	  return nil, err
	}
  
	return &rq, nil
}

// if the data is 
func (s *SmartContract) RequestData(ctx contractapi.TransactionContextInterface, assetid string, id string, priv_key string) error {
	asset, err := s.GetAsset(ctx, assetid)
	if err != nil {
		return err
	}
	if asset.DataType == Raw {
		return fmt.Errorf("the data is raw data, no need to decrypt")
	}
	if asset.DataType == Hash {
		return fmt.Errorf("the data is hash data, no need to decrypt")
	}
	if asset.DataType == Encrypted {
		sender , err:= ctx.GetClientIdentity().GetID()
		if err != nil {
			return err
		}
		request := Request{
			ID: id,
			AssetID: assetid,
			Sender: sender,
			Owner: asset.Owner,
			Privatekey: priv_key,
			Key: "",
			Status: Pending,
		}

		requestJSON, err := json.Marshal(request)
		if err != nil {
			return err
		}
		return ctx.GetStub().PutState(request.ID, requestJSON)
	}
	return nil
}

func (s *SmartContract) ProvideKey(ctx contractapi.TransactionContextInterface, id string, key string) error {
	request, err := s.GetRequest(ctx, id)
	if err != nil {
		return err
	}
	if request.Status != Pending {
		return fmt.Errorf("the request is not pending")
	}

	owner ,err:= ctx.GetClientIdentity().GetID();
	if err != nil {
		return err
	}

	if request.Owner != owner {
		return fmt.Errorf("the request is not for you")
	}
	request.Key = key
	request.Status = Approved
	requestJSON, err := json.Marshal(request)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(request.ID, requestJSON)
}

func (s *SmartContract) RejectRequest(ctx contractapi.TransactionContextInterface, id string) error {
	request, err := s.GetRequest(ctx, id)
	if err != nil {
		return err
	}
	if request.Status != Pending {
		return fmt.Errorf("the request is not pending")
	}

	owner ,err:= ctx.GetClientIdentity().GetID();
	if err != nil {
		return err
	}

	if request.Owner != owner {
		return fmt.Errorf("the request is not for you")
	}
	request.Status = Rejected
	requestJSON, err := json.Marshal(request)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(request.ID, requestJSON)
}

func (s *SmartContract) GetAllRequestForYou(ctx contractapi.TransactionContextInterface, id string) ([]*Request, error) {
	owner ,err:= ctx.GetClientIdentity().GetID();
	if err != nil {
		return nil, err
	}
	iterator, err := ctx.GetStub().GetStateByPartialCompositeKey("request~owner", []string{owner})
	if err != nil {
		return nil, err
	}
	var requests []*Request
	for iterator.HasNext() {
		responseRange, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var request Request
		err = json.Unmarshal(responseRange.Value, &request)
		if err != nil {
			return nil, err
		}
		requests = append(requests, &request)
	}
	return requests, nil
}