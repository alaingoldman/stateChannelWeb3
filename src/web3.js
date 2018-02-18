import Web3 from 'web3';
import contract from 'truffle-contract';
import _ from 'lodash';

var provider;
var web3;
// const provider = new Web3.providers.HttpProvider('http://localhost:8545');
// const web3 = new Web3(provider);

if(typeof web3 != 'undefined'){
   console.log("Using web3 detected from external source like Metamask")
   web3 = new Web3(web3.currentProvider)
}else{
   console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}
export default web3;

// export const selectContractInstance = (contractBuild) => {
//   return new Promise(res => {
//     const myContract = contract(contractBuild);
//     myContract.setProvider(provider);
//     myContract
//       .deployed()
//       .then(instance => res(instance));
//   })
// }

export const accountCheck = () => {
  if(typeof web3 != 'undefined'){
    console.log("account undefined");
    return "0x000000000000000000";
  }else{
    let result = web3.eth.accounts[0];
    return result;
  }
}

export const networkCheck = () => { 

      return true;
  //  determins which network user is on
  //  ganache test environment is id 5777 
  //  current implementation always returns true
  //  remember to turn this on before launch
  // let result = true;
  // web3.version.getNetwork((err, netId) => {`
  //   switch (netId) {
  //     case "1":
  //       // mainnet
  //       result = true;
  //       break
  //     case "2":
  //       // deprecated Morden test network
  //       break
  //     case "3":
  //       // ropsten test network
  //       break
  //     default:
  //       // unknown network
  //   }
  // })
  // return result;
}

export const mapReponseToJSON = (contractResponse, parameters, type) => {
  switch (type) {
    case 'arrayOfObject': {
      const result = [];
      contractResponse.forEach((paramValues, paramIndex) => {
        const paramName = parameters[paramIndex];
        paramValues.forEach((paramValue, itemIndex) => {
          const item = _.merge({}, _.get(result, [itemIndex], {}));
          if (typeof paramValue === 'string') {
            paramValue = web3.toUtf8(paramValue).trim();
          }
          item[paramName] = paramValue;
          result[itemIndex] = item;
        })
      });
      return result;
    }
    default:
      return contractResponse;
  }
}