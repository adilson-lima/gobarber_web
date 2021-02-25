import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import SignIn from '../../pages/SignIn'

const mockedHistoryPush = jest.fn()
const mockedSignIn = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => {
    return {
        // jest.fn() é uma funcao vazia que nao retorna nada
        useHistory: () => ({
            push: mockedHistoryPush
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    }
})

jest.mock('../../hooks/auth', () => {
    return {
        useAuth: () => ({
            signIn: mockedSignIn,
        })
    }
})


jest.mock('../../hooks/toast', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        })
    }
})



describe('SignIn Page', () => {

    beforeEach(() => {
        mockedHistoryPush.mockClear();
    })

    it('should be able to sign in', async () => {

        // const { debug } = render(<SignIn />)
        //Mostra o html como se fosse um console.log
        // debug();

        const { getByPlaceholderText, getByText } = render(<SignIn />)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
        fireEvent.change(passwordField, { target: { value: '123456' } })

        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedHistoryPush).toHaveBeenCalled();
        })


    });


    it('should not be able to sign in', async () => {

        // const { debug } = render(<SignIn />)
        //Mostra o html como se fosse um console.log
        // debug();

        const { getByPlaceholderText, getByText } = render(<SignIn />)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
        fireEvent.change(passwordField, { target: { value: '123456' } })

        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard')
        })
    });


    it('should display an error if login fails', async () => {

        mockedSignIn.mockImplementation(() => {
            throw new Error();
        })



        const { getByPlaceholderText, getByText } = render(<SignIn />)

        const emailField = getByPlaceholderText('E-mail')
        const passwordField = getByPlaceholderText('Senha')
        const buttonElement = getByText('Entrar')

        fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
        fireEvent.change(passwordField, { target: { value: '123456' } })

        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error'
                })
            )
        })


    });


});