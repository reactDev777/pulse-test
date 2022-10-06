import { erc1155Abi, erc1155Address } from '../utils/contract/erc1155Abi';
import Web3 from 'web3';
import { CommonUtility } from '../utils/common';

class ERC1155 {
    // <<<<--- READ FUNCTIONS --->>>>

    async balance(account: string | null, tokenId: any) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc1155Abi,
                erc1155Address
            );
            const balance = await contract.methods
                .balanceOf(account, tokenId)
                .call();
            return balance;
        } catch (error) {
            console.log('error in balance func', error);
            let newError = { message: error };
            return newError;
        }
    }
}

const ERC1155Service = new ERC1155();
Object.freeze(ERC1155Service);
export { ERC1155Service };
