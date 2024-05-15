import { useNavigate } from "react-router-dom";

function ProviderOrUser() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>ProviderOrUser</h1>
            <button onClick={()=>navigate('/provider')}>
                Provider
            </button>
            <button onClick={()=>navigate('/user')}>
                User
            </button>
        </div>
    );
}

export default ProviderOrUser;