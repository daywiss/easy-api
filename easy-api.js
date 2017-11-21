'use strict'
var fetch = require('isomorphic-fetch')
var join = require('url-join')

module.exports = function(options){
  if(options == null) throw new Error('Requires options')
  var {host,name,token,timeout,resolveWithFullResponse} = options
  if(host == null) throw new Error('Requires host url')
  name = name || ''
  timeout = timeout || 10000
  resolveWithFullResponse = resolveWithFullResponse || false

  function call(action,params,token,method){
    var url = urljoin(host,action)
    var options = {
      method:method,
      headers:{
        'Content-Type':'application/json',
      },
      timeout:timeout,
      mode:'cors',
    }
    if(token){
      options.headers.Authorization = "Bearer " + token
    }
    if(params && options.method == 'POST'){
      options.body = JSON.stringify(params) 
    }
    return fetch(url,options).then(function(res){
      //fetch has a really wierd return api
      //we get the result as text just incase json causes error
      return Promise.all([res.ok,res.text()])
    }).then(function(body){
      var result = null
      var ok = body[0]
      var text = body[1]
      //try parsing json, if fail return text
      try{
        result = JSON.parse(text)
      }catch(e){
        result = text
      }
      ///fetch has an ok property, to signify if http code was an error
      if(ok || resolveWithFullResponse){
        return result
      }else{
        throw new Error(result)
      }
    })
  }

  function get(action,params,token){
  }


}
