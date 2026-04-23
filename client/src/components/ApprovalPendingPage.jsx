import useAuth from "../hooks/useAuth";

export default function ApprovalPendingPage(){
    const { user } = useAuth();

    return (
        <>
            <div className="min-h-screen flex flex-col max-w-2xl w-full mx-auto items-center text-center pt-16">
                <div className="flex flex-col rounded-box bg-base-200 p-16">
                <h1 className="text-4xl sm:pb-10">Hi there, Recruiter {user.displayName}!</h1>
                <p>We are <b>currently </b>processing your account.<br />
                Please give our admin <b>3-7 business days</b> to approve your account for access.<br />
                We thank you for your patience!
                </p>
                <h1 className="text-xl text-right pt-2 sm:pt-10">- Universal Careers Team</h1>
                </div>
            </div>
        </>
    )
}