// main.js
$(document).ready(function() {
    // 初始化 Firebase
    
    
  
    $("#start-button").click(function(){
        // 儲存數據到 sessionStorage
        sessionStorage.setItem("userChoice", "exampleData");
        // 跳轉到 2pick 頁面
        window.location.href = "2pick.html";
    });
});
  