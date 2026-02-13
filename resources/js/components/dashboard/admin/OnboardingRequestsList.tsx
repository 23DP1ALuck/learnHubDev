import {OnboardingRequest} from "@/types";

export const OnboardingRequestsList = ({requests}: {requests: OnboardingRequest[]}) => {
    return (
        <div className="flex flex-col gap-4">
            {requests.map((request: OnboardingRequest, index: number) => {
                return <div className="flex gap-2" key={index}>
                    <h1>
                        {request.email}
                    </h1>
                    <h1>
                        {request.status}
                    </h1>
                </div>
            })}
        </div>
    )
}
