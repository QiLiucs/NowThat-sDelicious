import { $ } from "./bling";

const axios=require("axios")
function axiosheart(e){
    e.preventDefault();//只是拒绝跳转到action的页面，但是action的内容还是会被执行
    axios.post(this.action).then(res=>{
        //this is the form
        //this.heart is the elem whose name is heart
        const isHearted=this.heart.classList.toggle("heart__button--hearted");
        $(".heart-count").textContent=res.data.hearts.length;
        if(isHearted){
            this.heart.classList.add("heart__button--float");
            // setTimeout(()=>{
            //     this.heart.classList.remove("heart__button--float"),2500
            // })
        }
    })
}
export default axiosheart;