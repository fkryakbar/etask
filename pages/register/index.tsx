import FirstPageLayout from "@/components/Layout/FirstPageLayout";
import { signUpNewUser } from "@/utils/Authentication";
import { Toast } from "@/utils/Swal";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Register() {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false)


    async function onRegister(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        setIsLoading(true)

        signUpNewUser(data.name, data.email, data.password, data.confirmPassword, setIsLoading, form);

    }

    function setEmail(email: string) {
        setData({
            ...data,
            email: email
        })

    }
    function setName(name: string) {
        setData({
            ...data,
            name: name
        })
    }
    function setPassword(password: string) {
        setData({
            ...data,
            password: password
        })

    }
    function setConfirmPassword(confirm_password: string) {
        setData({
            ...data,
            confirmPassword: confirm_password
        })

    }

    return (
        <FirstPageLayout title="Register">
            <div className="h-screen flex justify-center items-center">
                <div className="lg:w-[350px] w-full mx-5 bg-white shadow-md rounded-lg p-5 dark:bg-slate-900 dark:text-white">
                    <Link href="/">
                        <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#00ff87] to-[#60efff]'>
                            eTask
                        </h1>
                    </Link>
                    <p className="mt-5 font-bold text-lg">Create an Account</p>
                    <p className="mt-2  text-sm">Before login to <b>eTask</b></p>

                    <form action="" className="mt-5" method="POST" onSubmit={onRegister}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" name="name" onChange={e => setName(e.target.value)} placeholder="Type your name" className="input input-bordered w-full max-w-xs" disabled={isLoading} />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" onChange={e => setEmail(e.target.value)} placeholder="Type your email" className="input input-bordered w-full max-w-xs" disabled={isLoading} />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" onChange={e => setPassword(e.target.value)} placeholder="Choose password" className="input input-bordered w-full max-w-xs" disabled={isLoading} />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input type="password" name="confirm_password" onChange={e => setConfirmPassword(e.target.value)} placeholder="Retype password" className="input input-bordered w-full max-w-xs" />
                        </div>
                        <div className="form-control w-full max-w-xs mt-3">
                            <button type="submit" className="btn bg-green-400 text-white hover:bg-green-700" disabled={isLoading}>
                                Create Account
                            </button>
                        </div>
                    </form>
                    <p className="my-3 text-center text-sm">Already have an account? Click <Link className="text-green-400" href="/login">here</Link> to login</p>
                </div>
            </div>
        </FirstPageLayout>
    )
}