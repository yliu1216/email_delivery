import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";


const Register = ()=>{
    // page redirect
    const router = useRouter();

    //hooks for registration
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    //call api for user registration
    const handleRegister = async(e) => {
        e.preventDefault();
        try{
            const responseData = await axios.post(
                `http://127.0.0.1:50000/auth/register`, 
                {username, password}, {withCredentials:true}
            );
            console.log(responseData);
            alert('login successful');
            setUsername('');
            setPassword('');  
            router.push({
                pathname: '/login',
            })  
        }catch(err){
            console.log(err);
        }
    }

    //handle mouse over
    function handleMouseOver(event) {
        setIsMouseOver(true);
    }

    function handleMouseOut(event) {
        setIsMouseOver(false);
    }
    
    //ensure input is not null
    useEffect(()=>{
        if(username.length > 0 && password.length > 0){
            setButtonDisable(false);
        }else{
            setButtonDisable(true);
        }
    }, [username, password]);

    return(
        <div className='mt-4 grow flex items-center justify-around'>
        <div className='mt-32'>
            <h1 className='mt-12 text-3xl text-center mb-4 text-black'>Register</h1>
            <form className='mx-w-md mx-auto'>
                <input 
                 type="text"
                 value={username} 
                 onChange={e=>setUsername(e.target.value)}
                 placeholder='Please enter your username'/>
                 <br/>
                <input
                   type="password"
                   value={password} 
                   onChange={e=>setPassword(e.target.value)}
                   placeholder='Please enter your password'
                />
                <button className='bg-black p-2 w-full rounded-2xl text-white' style={{backgroundColor:isMouseOver?'#A9A9A9':'#000000'}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={handleRegister}>{buttonDisable?"Register":"Submit"}</button>
                <div>
                    <p className='text-center py-2 text-gray-400'>Already have an account ? <Link href='/login' className='text-black'>Login Now</Link></p>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Register;

