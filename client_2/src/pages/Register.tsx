"use client"

import React, { useEffect, useState } from 'react';

import { InfinitySpin } from 'react-loader-spinner';

import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import axios from '../api/axios-config'
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { useRecoilState, useRecoilStateLoadable } from 'recoil';
import { userAtom } from '@/store/user-atom';

import Logo from '../assets/icons/logo.png';
import Logo_name from '../assets/icons/logo_name.png';

const username_regex = /^[A-z][A-z0-9-_]{3,23}$/;
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const register_url = '/user/signup';

const formSchema = z.object({
    username: z
        .string()
        .min(4, "Username must be at least 4 characters.")
        .max(24, "Username can be at most 24 characters.")
        .regex(username_regex, 'Username must start with an alphabet and only supports alphanumeric characters, underscore and hyphen'),
    email: z
        .string()
        .regex(email_regex, "Not a valid email"),
    password: z.string()
        .min(3, "Password must be at least 8 characters.")
        .max(23, "Password can be at most 24 characters.")
        .regex(password_regex, 'Password must include lower case & upper case letters, numbers, and any special character(!, @, #, $, %)')
});

export default function Register() {
    const [user, setUser] = useRecoilStateLoadable(userAtom);

    if(user.state == 'loading'){
        return (<></>);
    }else{
        return (
          <>
            <div className='absolute flex flex-row top-0 left-0 m-5 gap-5'>
              <img src={Logo} className='h-10 w-10' />
              <img src={Logo_name} className='h-10' />
            </div>
            <div className='h-screen w-screen flex flex-col justify-center items-center'>
                <div className='text-foreground font-semibold text-xl font-sans mb-7'>Register</div>
                <RegisterForm />
            </div>
          </>
        );
    }
}

function RegisterForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
      },
    });

    const { toast } = useToast();

    const navigate = useNavigate();
   
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post(register_url,
                JSON.stringify(values),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            toast({
                variant: 'successful',
                title: "Successfully registered",
                description: `Welcome to Projecctory, ${response.data.data.username}`,
            });
            localStorage.setItem("SavedToken", 'Bearer ' + response.data.data.access);
            navigate('/home');

        } catch (error) {
            if (error.response.data.error.err){
                if (error.response.data.error.err == 'Username has been taken'){
                    toast({
                        variant: 'destructive',
                        title: "Username has already been taken",
                        description: "Try using a different username or login to existing account.",
                    });
                }
                if (error.response.data.error.err == 'Email already in use'){
                    toast({
                        variant: 'destructive',
                        title: "Email is already in use",
                        description: "Use another email or login to existing account.",
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="user" {...field} autoComplete='off' />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                <div className='text-primary text-sm font-regular mt-5'>Already have an account? <Link to='/login'><span className='font-semibold hover:underline cursor-pointer'>Login</span></Link></div>
            </div>
          </form>
        </Form>
      );
}