import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import Cart from './Cart';
import { useStateContext } from '../context/StateContext';
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
    const { showCart, setShowCart, totalQuantities } = useStateContext();
    const { data: session } = useSession();
    return (
        <div className='navbar-container'>
            <p className='logo'>
                <Link href='/'>Electra Store</Link>
            </p>
            {session ? (
                <h2>Welcome To Electra Store</h2>
            ) : <p style={{ color: 'red' }}>Please sign in to shop</p>}

            <div>
                {session ? (
                    <>
                        <button className='button-1' onClick={() => signOut()}>Logout</button>
                        <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
                            <AiOutlineShopping />
                            <span className='cart-item-qty'>{totalQuantities}</span>
                        </button>
                    </>
                ) :
                    <button className='button-1' onClick={() => signIn()}>
                        Sign In
                    </button>
                }
            </div>

            {showCart && <Cart />}
        </div>
    );
};

export default Navbar;

