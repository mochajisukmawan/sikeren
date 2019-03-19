/*
Template Name: DHR - HTML Mobile Template
Author: Dreamguy's Technologies
Version:1.0
*/


// Dom7

var $$ = Dom7;

// Framework7 App main instance

var app  = new Framework7({
	root: '#app', // App root element
	id: 'com.myapp.test',
	name: 'Framework7', // App name
	theme: 'ios',
	// App root methods
	methods: {
		helloWorld: function () {
		app.dialog.alert('Hello World!');
		},
	},
	view: {
		iosDynamicNavbar: false,
		xhrCache: false,
	},
	photoBrowser: {
		type: 'popup',
	},
	popup: {
		closeByBackdropClick: false,
	},
	actions: {
		convertToPopover: false,
		grid: true,
	},
	// App routes
	routes: routes
});

// Sidebar

! function($) {
    "use strict";
    var Sidemenu = function() {
        this.$menuItem = $("#sidebar-menu a");
    };

	Sidemenu.prototype.init = function() {
		var $this = this;
		$this.$menuItem.on('click', function(e) {
		if ($(this).parent().hasClass("submenu")) {
			e.preventDefault();
		}
		if (!$(this).hasClass("subdrop")) {
			$("ul", $(this).parents("ul:first")).slideUp(350);
			$("a", $(this).parents("ul:first")).removeClass("subdrop");
			$(this).next("ul").slideDown(350);
			$(this).addClass("subdrop");
		} else if ($(this).hasClass("subdrop")) {
			$(this).removeClass("subdrop");
			$(this).next("ul").slideUp(350);
		}
	});
		$("#sidebar-menu ul li.submenu a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
	},
	$.Sidemenu = new Sidemenu;

}(window.jQuery),


$(document).ready(function($) {
	var calendarDefault = app.calendar.create({
  input: '#bod'
});
//==============================================================================
	// Sidebar Initiate
	$.Sidemenu.init();
});
function is_login(callback){
	if(localStorage.getItem("session") == null){
		if (typeof callback == "function") {
				callback();
		}
	}
}
function authenticate(callback){
  if(localStorage.getItem("session") != null){
    var session = JSON.parse(localStorage.getItem("session"));
    var datas = new FormData();
    datas.append("user_name", session.kode_register);
    datas.append("user_password", session.hash);
    $.ajax({
       type: "POST",
       url: "http://10.64.5.40/sikeren/api/validation",
       data: datas,
       processData: false,
       contentType: false,
       success: function(data) {
         if(data.error == true){
           if (typeof callback == "function") {
               callback(data);
           }
         }
       },
       error: function(data) {
         if (typeof callback == "function") {
             callback(data);
         }
       }
     });
  }else{
    if (typeof callback == "function") {
        callback(0);
    }
  }
}
app.on('formAjaxBeforeSend', function (formEl, data, xhr) {
	app.preloader.show();
});
app.on('formAjaxSuccess', function (formEl, data, xhr) {
	app.preloader.hide();
	if($(formEl).attr('id')=="formlogin"){
		var output = JSON.parse(xhr.responseText);
		if(output.error == false){
			localStorage.setItem("session", xhr.responseText);
			app.router.navigate('/');
		}else{
			//kondisi jika login tidak berhasil
			var toastTop = app.toast.create({
			  text: 'Kombinasi Kode register & Password Tidak Sesuai',
			  position: 'top',
			  closeTimeout: 2000,
			});
			toastTop.open();
		}
	}
});
app.on('formAjaxError', function (formEl, data, xhr) {
	app.preloader.hide();
});

function logout(){
  app.dialog.create({
      title: 'Logout Confirm',
      text: 'Apakah anda yakin ingin keluar ?',
      buttons: [{
              text: 'No',
              onClick: function() {}
          },
          {
              text: 'Yes',
              onClick: function() {
                  localStorage.removeItem("session");
									app.router.navigate('/login/');
              }
          }
      ],
      verticalButtons: false,
  }).open();
}
