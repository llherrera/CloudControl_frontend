const PingPage = () => {
    
    const { data, error, isLoading, isError } = useQuery('ping', () =>
        fetch('/api/ping').then((res) => res.json())
    );
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (isError) {
        return <div>Error: {error}</div>;
    }
    
    return <div>{data.message}</div>;
};

function useQuery(arg0: string, arg1: () => Promise<any>): { data: any; error: any; isLoading: any; isError: any; } {
    throw new Error("Function not implemented.");
}

export default PingPage;