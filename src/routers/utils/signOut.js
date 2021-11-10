const axios = require('axios')


const signOut = async(token)=>{
    const config = {
        method: 'post',
        url: 'http://localhost:3000/users/logout',
        headers: { 
          'Authorization':  `Bearer ${token}`
        }
      }

      try{
        const response= await axios(config)
        return response
      }catch(error){
          return error
      }
}

module.exports={
    signOut
}

