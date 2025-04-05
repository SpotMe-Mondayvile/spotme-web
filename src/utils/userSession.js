export function checkLogin(navigate){

    try{
      const token= localStorage.getItem("token")
      if(token==null){navigate.push('/Login','root','replace')}
    }catch(e){
      navigate.push('/Login','root','replace')
      console.log("No token on Home page")
    }
  }
