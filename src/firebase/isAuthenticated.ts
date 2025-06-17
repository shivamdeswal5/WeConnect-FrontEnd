
export default function isAuthenticated() {
  const token =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('token') || '{}')
      : {};

    if(token.length===0){
        return false;
    }else{
        return true;
    }
}
