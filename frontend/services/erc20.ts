import { erc20Abi, erc20Address } from '../utils/contract/erc20Abi';
import Web3 from 'web3';
import { CommonUtility } from '../utils/common';

class ERC20 {
    // <<<<--- READ FUNCTIONS --->>>>

    async tokenBalance(tokenAddress: any, account: string) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const balance = +(await contract.methods.balanceOf(account).call());
            const decimals = +(await contract.methods.decimals().call());
            return balance / 10 ** decimals;
        } catch (error) {
            console.log('error in tokenBalance func', error);
            return error;
        }
    }

    async balance(tokenAddress: any, account: string | null) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const balance = await contract.methods.balanceOf(account).call();
            return balance;
        } catch (error) {
            console.log('error in balance func', error);
            return error;
        }
    }

    async approval(
        tokenAddress: any,
        spenderAddress: any,
        amount: any,
        account: any
    ) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const approve = await contract.methods
                .approve(spenderAddress, amount)
                .send({ from: account });
            return approve;
        } catch (error) {
            console.log('error in approval func', error);
            let newError = { message: error };
            return newError;
        }
    }

    async name(tokenAddress: any) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const name = await contract.methods.name().call();
            console.log('fnName', name);
            return name;
        } catch (error) {
            console.log('Error in name func', error);
            let newError = { message: error };
            return newError;
        }
    }

    // async name(tokenAddress: any) {
    //     console.log('name', tokenAddress);
    //     try {
    //         const web3 = new Web3(Web3.givenProvider);
    //         const contract = CommonUtility.contract(
    //             web3,
    //             erc20Abi,
    //             tokenAddress
    //         );
    //         const name = await contract.methods.name().call();
    //         console.log('name2', name);

    //         return name;
    //     } catch (error) {
    //         console.log('Error in name func', error);
    //         return error;
    //     }
    // }

    async symbol(tokenAddress: any) {
        try {
            const web3 = new Web3(Web3.givenProvider);
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const symbol = await contract.methods.symbol().call();
            return symbol;
        } catch (error) {
            console.log('Error in symbol func', error);
            let newError = { message: error };
            return newError;
        }
    }

    async decimals(tokenAddress: any) {
        const web3 = new Web3(Web3.givenProvider);
        try {
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const decimals = await contract.methods.decimals().call();
            return +decimals;
        } catch (error) {
            console.log('error in decimals func', error);
            let newError = { message: error };
            return newError;
        }
    }

    async allowance(
        tokenAddress: any,
        userAddress: string | null,
        cronAddress: any
    ) {
        const web3 = new Web3(Web3.givenProvider);
        try {
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            const allowance = await contract.methods
                .allowance(userAddress, cronAddress)
                .call();
            return allowance;
        } catch (error) {
            let newError = { message: error };
            console.log('error in Allowance func', error);
            return newError;
        }
    }

    async uniswapV2Pair(tokenAddress: any) {
        console.log('uniswap', tokenAddress);
        const web3 = new Web3(Web3.givenProvider);
        try {
            const contract = CommonUtility.contract(
                web3,
                erc20Abi,
                tokenAddress
            );
            console.log('contract', contract.methods);
            const uniswap = await contract.methods.uniswapV2Pair().call();
            console.log('uniswapAfter', uniswap);

            return uniswap;
        } catch (error) {
            console.log('error in uniswapV2 func', error);
            return error;
        }
    }
}

const ERC20Service = new ERC20();
Object.freeze(ERC20Service);
export { ERC20Service };
