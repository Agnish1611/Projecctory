"use client"

import React from 'react';

import { userAtom } from '@/store/user-atom';
import Cookies from 'js-cookie';

import axios from '../api/axios-config';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import Logo from '../assets/icons/logo.png';
import Logo_name from '../assets/icons/logo_name.png';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useRecoilStateLoadable } from 'recoil';

const login_url = '/user/login';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const [user, setUser] = useRecoilStateLoadable(userAtom);

  const navigate = useNavigate();

  if (user.state == 'loading') {
    return (<div>Loading .....</div>);
  } else {
    console.log(user.contents);
    if (user.contents.id) {
      navigate('/home');
    }
    return (
      <>
        <div className='absolute flex flex-row top-0 left-0 m-5 gap-5'>
          <img src={Logo} className='h-10 w-10' />
          <img src={Logo_name} className='h-10' />
        </div>
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
          <div className='text-foreground font-semibold text-xl font-sans mb-7'>Login</div>
          <LoginForm />
        </div>
      </>
    );
  }
}

function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const { toast } = useToast();

  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(login_url,
        JSON.stringify(values),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      toast({
        variant: 'successful',
        title: "Successfully logged in",
        description: `Welcome to Projecctory, ${response.data.data.username}`,
      });
      Cookies.set('authToken', response.data.data.access, {
        secure: true,
        sameSite: 'strict',
        expires: 7
      });
      navigate('/home');

    } catch (error) {
      if (error.response.data.error.err) {
        if (error.response.data.error.err == 'no user found') {
          toast({
            variant: 'destructive',
            title: "No user found",
            description: "Email doesn't exist. Try another email or register",
          });
        }
        if (error.response.data.error.err == 'wrong password') {
          toast({
            variant: 'destructive',
            title: "Wrong password",
            description: "The password you entered is incorrect",
          });
        }
      }
      else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[25rem] border p-10 rounded-lg">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@email.com" {...field} autoComplete='off' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password#1234" {...field} autoComplete='off' type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col items-center'>
          <Button type="submit">Submit</Button>
          <div className='text-primary text-sm font-regular mt-5'>Don't have an account? <Link to='/register'><span className='font-semibold hover:underline cursor-pointer'>Register</span></Link></div>
        </div>
      </form>
    </Form>
  );
}