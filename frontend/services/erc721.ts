import { erc721Abi } from '../utils/contract/erc721Abi';
import Web3 from 'web3';
import { CommonUtility } from '../utils/common';

class ERC721 {
    // <<<<--- READ FUNCTIONS --->>>>

    async balanceOf(userAddress: string, erc721Address:string) {
        const web3 = new Web3(Web3.givenProvider);
        try {
            const contract = CommonUtility.contract(
                web3,
                erc721Abi,
                erc721Address
            );
            const balance = await contract.methods
                .balanceOf(userAddress)
                .call();
            return balance;
        } catch (error) {
            console.log('error in Balance func', error);
            return error;
        }
    }
}

const ERC721Service = new ERC721();
Object.freeze(ERC721Service);
export { ERC721Service };
