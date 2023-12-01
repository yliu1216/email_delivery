import { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const Login = ()=>{
    //page redirect
    const router = useRouter();
    // declare hooks for login
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isMouseOut, setIsMouseOut] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);
    

    //call api for user login
    const handleLogin = async(e) => {
        e.preventDefault();
        try{
            const responseData = await axios.post(
                `http://127.0.0.1:50000/auth/login`, 
                {username, password}, {withCredentials:true}
            );      
            const{token} = responseData.data.data;
            console.log(token);
            alert('login successful');
            setUsername('');
            setPassword('');    
            router.push({
                pathname: '/',
                query: { SESSION_TOKEN: token },
              });

        }catch(err){
            console.log(err);
        }
    }

    //handle mouse over
    function handleMouseOver(event) {
        setIsMouseOver(true);
    }

    //handle mouse out
    function handleMouseOut(event) {
        setIsMouseOver(false);
    }

    const controlMouseOver = ()=>{
        setIsMouseOut(false);
      };
    
    const controlMouseOut = ()=>{
        setIsMouseOut(true);
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
            <h1 className='mt-12 text-3xl text-center mb-4 text-black'>Login</h1>
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
                <button className='bg-black p-2 w-full rounded-2xl text-white' 
                    style={{backgroundColor:isMouseOver?'#A9A9A9':'#000000'}} 
                    onMouseOver={handleMouseOver} 
                    onMouseOut={handleMouseOut} 
                    onClick={handleLogin}>
                    {buttonDisable?"Login":"Submit"}
                </button>
                <div>
                    <p className='text-center py-2 text-gray-400'>Dont have an account yet? <Link href='/register' className='text-black'>Register Now</Link></p>

                </div>

                <div className='text-center max-w-lg mx-auto'>
                    <Link href='/'>
                        <div className="text-white py-2 px-4 w-full rounded-full justify-around mt-12 gap-2 mb-8" 
                        style={{ backgroundColor: isMouseOut ? '#A9A9A9' : '#ef4444' }} 
                        onMouseOver={controlMouseOver} 
                        onMouseOut={controlMouseOut}
                        >
                          Back to Main Page
                        </div>
                    </Link>
                </div>

            </form>
        </div>
    </div>
    )
}

export default Login;

