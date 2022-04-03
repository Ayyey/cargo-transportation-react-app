import { useState } from "react";

export const useFetching = (callback) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    const  fetching = async () => {
        try{
            setIsLoading(true);
            await callback();
        }
        catch (e){
            setIsError(true);
            setIsLoading(false);
        }
        finally{
            setIsLoading(false);
        }
    }

    return [fetching, isLoading, isError]
}