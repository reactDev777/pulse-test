import { AbiItem } from 'web3-utils';

let WAValidator = require('public-address-validator');
export class CommonUtility {
    static addressConvertor(address: any) {
        if ((address || '').length < 10) {
            return address || '';
        }
        return `${address.slice(0, 4)}...${address.slice(address.length - 6)}`;
    }

    static contract(web3: any, abi: any, address: any) {
        return new web3.eth.Contract(abi as AbiItem[], address);
    }

    static validateAddress = (address: any, token: any) => {
        var valid = WAValidator.validate(address, token);
        if (valid) {
            return valid;
        } else {
            return valid;
        }
    };
}
