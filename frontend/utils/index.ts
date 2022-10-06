export const accountEllipsis = (account: string | null) => {
    return account
        ? `${account.substring(0, 8)}...${account.substring(
              account.length - 3
          )}`
        : null;
};
