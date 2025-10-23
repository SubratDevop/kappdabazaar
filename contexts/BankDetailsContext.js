import React, { createContext, useState, useContext, useEffect } from 'react';
import BankDetailsService from '../services/BankDetailsService';

const BankDetailsContext = createContext();

export const useBankDetails = () => {
    const context = useContext(BankDetailsContext);
    if (!context) {
        throw new Error('useBankDetails must be used within a BankDetailsProvider');
    }
    return context;
};

export const BankDetailsProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await BankDetailsService.getBankAccounts();
            setAccounts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addAccount = async (accountData) => {
        try {
            setError(null);
            const newAccount = await BankDetailsService.addBankAccount(accountData);
            setAccounts(prevAccounts => [...prevAccounts, newAccount]);
            return newAccount;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateAccount = async (accountId, accountData) => {
        try {
            setError(null);
            const updatedAccount = await BankDetailsService.updateBankAccount(accountId, accountData);
            setAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.id === accountId ? updatedAccount : account
                )
            );
            return updatedAccount;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteAccount = async (accountId) => {
        try {
            setError(null);
            await BankDetailsService.deleteBankAccount(accountId);
            setAccounts(prevAccounts =>
                prevAccounts.filter(account => account.id !== accountId)
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const setDefaultAccount = async (accountId) => {
        try {
            setError(null);
            const updatedAccount = await BankDetailsService.setDefaultBankAccount(accountId);
            setAccounts(prevAccounts =>
                prevAccounts.map(account => ({
                    ...account,
                    isDefault: account.id === accountId
                }))
            );
            return updatedAccount;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const value = {
        accounts,
        loading,
        error,
        fetchAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        setDefaultAccount
    };

    return (
        <BankDetailsContext.Provider value={value}>
            {children}
        </BankDetailsContext.Provider>
    );
};

export default BankDetailsContext; 