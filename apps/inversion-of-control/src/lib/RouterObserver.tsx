export class RouterObserver {
  constructor(private readonly  listeners = new Set<()=>void>()){
    const notify = this.notify.bind(this)
    const originalPushState = window.history.pushState.bind(window.history);
    
    window.history.pushState = function(...args){
      originalPushState(...args);
      notify()
    }
  }


  notify(){
    this.listeners.forEach(cb => cb())
  }

  subscribe(cb: ()=>void){
    this.listeners.add(cb)

    return ()=>{
      this.listeners.delete(cb)
    }
  }

  getvalue(){
    return window.location
  }
  
}
