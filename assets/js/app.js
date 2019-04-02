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
	routes: routes,
	on: {
		pageInit(page) {
		},
	pageAfterIn(page) {
		},
	}
});
var isi_semua = app.toast.create({
  text: 'Isi Semua Pertanyaan.',
  position: 'top',
  closeTimeout: 2000,
});

var absen_pagi_berhasil = app.toast.create({
  text: 'Absen Pagi Berhasil',
  position: 'center',
  closeTimeout: 2000,
});

var sudahabsenpagi = app.toast.create({
  text: 'Anda sudah melakukan presensi pagi.',
  position: 'center',
  closeTimeout: 2000,
});

var sudahabsensore = app.toast.create({
  text: 'Anda sudah melakukan presensi sore.',
  position: 'center',
  closeTimeout: 2000,
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
function autocomplete(selector,urlx){
	var autocompleteStandaloneAjax = app.autocomplete.create({
			openIn: 'popup', //open in page
			openerEl: selector, //link that opens autocomplete
			multiple: false, //allow multiple values
			valueProperty: 'id', //object's "value" property name
			textProperty: 'name', //object's "text" property name
			limit: 20,
			closeOnSelect: true,
			preloader: true, //enable preloader
			source: function(query, render) {
					var autocomplete = this;
					var results = [];
					if (query.length === 0) {
							render(results);
							return;
					}
					// Show Preloader
					autocomplete.preloaderShow();
					// Do Ajax request to Autocomplete data
					app.request({
							url: urlx,
							method: 'POST',
							dataType: 'json',
							//send "query" to server. Useful in case you generate response dynamically
							data: {query: query},
							success: function(data) {
									// Find matched items
									for (var i = 0; i < data.length; i++) {
											if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
									}
									// Hide Preoloader
									autocomplete.preloaderHide();
									// Render items by passing array with result items
									render(results);
							}
					});
			},
			on: {
					opened: function() {
							$('.autocomplete-page .navbar-inner').css("background-color", "#007aff");
								app.preloader.hide();
					},
					change: function(value) {
							var itemText = [],
									inputValue = [];
							for (var i = 0; i < value.length; i++) {
									itemText.push(value[i].name);
									inputValue.push(value[i].id);
							}
							// Add item text value to item-after
							$$(selector).find('.item-after').text(itemText.join(', '));
							// Add item value to input value
							$$(selector).find('input').val(inputValue.join(', '));
					},
			},
	});
}
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
};
function cari_us(){
	app.preloader.show();
 var tanggal_us = $('#waktu_us').val();
 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 var date = tanggal_us.split("-");
 var tahun = date[0];
 var bulan = date[1];
 $('.keterangan-uk').html("Uang saku dan Uang Makan "+months[bulan-1]+" "+tahun);
 var session = JSON.parse(localStorage.getItem("session"));
 var nomor_register = session.nomor_register;
	var datas = new FormData();
	datas.append("nomor_register", nomor_register);
	datas.append("bulan_tahun", tanggal_us);
	$.ajax({
		 type: "POST",
		 url: "http://10.64.5.40/sikeren/api/uang_saku",
		 data: datas,
		 processData: false,
		 contentType: false,
		 success: function(data) {

			 $('.us').html("Rp "+data.uang_saku);
			 $('.tp').html("Rp "+data.t_penampilan);
			 $('.tbks').html("Rp "+data.t_bpjs_kes);
			 $('.tbkn').html("Rp "+data.t_bpjs_ktn);
			 $('.um').html("Rp "+data.uang_makan);
			 $('.thp').html("Rp "+data.take_home_pay);
			 app.preloader.hide();
		 },
		 error: function(data) {
		 }
	 });
}
function cari_kehadiran(){
	app.preloader.show();
	$("#list").html("");
	var tanggal_us = $('#waktu_kehadiran').val();
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var date = tanggal_us.split("-");
	var tahun = date[0];
	var bulan = date[1];
	$('.keterangan-kehadiran').html("Daftar Kehadiran Bulan "+months[bulan-1]+" "+tahun);

	var session = JSON.parse(localStorage.getItem("session"));
	var nomor_register = session.nomor_register;
	var datas = new FormData();
	datas.append("nomor_register", nomor_register);
	datas.append("bulan_tahun", tanggal_us);
	$.ajax({
		 type: "POST",
		 url: "http://10.64.5.40/sikeren/api/kehadiran",
		 data: datas,
		 processData: false,
		 contentType: false,
		 success: function(data) {
			 console.log(data);
			 var kehadiran=data.kehadiran;
			 for(var i in kehadiran){
			 	var date = kehadiran[i].tanggal.split("-");
			 	var tahun = date[0];
				var bulan = date[1];
			 	var tanggal = date[2];
				 $("#list").append(`
					 <li>
   					<a class="item-link item-content">
   						<div class="item-inner">
   							<div class="item-title-row">
   								<div class="item-title">Tanggal</div>
   								<div class="inv-status">`+tanggal+` `+months[bulan-1]+` `+tahun+`</div>
   							</div>
								<div class="item-title-row">
									<div class="item-title">Jam In </div>
									<div class="inv-status">`+kehadiran[i].jam_in+`</div>
								</div>
								<div class="item-title-row">
									<div class="item-title">Jam Out</div>
									<div class="inv-status">`+kehadiran[i].jam_out+`</div>
								</div>
								<div class="item-title-row">
									<div class="item-title">Approve</div>
									<div id="cek_`+i+`" class="inv-status">`+kehadiran[i].approve+`</div>
								</div>
   						</div>
   					</a>
   				 </li>

					 `);
					 if(kehadiran[i].approve!="Approved"){
						 $("#cek_"+i).css('color', 'red');
					 }else {
					 	$("#cek_"+i).css('color', 'green');
					 }
				 // $('#tgl').html(""+data.tanggal);
				 // $('#jam_in').html("Jam In "+data.jam_in);
				 // $('#jam_out').html("Jam Out "+data.jam_out);
			 }
			 app.preloader.hide();
		 },
		 error: function(data) {
		 }
	 });
}
var data_pertanyaan;
var data_pertanyaan_transaksi;
function cek_absen(jenis_absen){
	var session = JSON.parse(localStorage.getItem("session"));
	var nomor_register = session.nomor_register;
	var date_now = new Date().toISOString().slice(0,10);
	 var datas = new FormData();
	 datas.append("tanggal", date_now);
	 datas.append("nomor_register", nomor_register);
	 $.ajax({
			type: "POST",
			url: "http://10.64.5.40/sikeren/api/"+jenis_absen+"",
			data: datas,
			processData: false,
			contentType: false,
			success: function(data) {

					if(data.error == true){
						if(jenis_absen == 'absenPagi'){
							sudahabsenpagi.open();
							localStorage.setItem("coderating", data.coderating);
							app.router.navigate('/ratting/');
						}else{
							pesan(data.error_confirm);
						}
					}else{
						if(jenis_absen == 'absenPagi'){
							data_pertanyaan = data.data;
							app.router.navigate('/absen-budaya/');
						}else{
							console.log(data);
							data_pertanyaan = data.quisioner_sore;
							data_pertanyaan_transaksi = data.quisioner_transaksi;
							app.router.navigate('/absen-sore/');
						}

					}
			},
			error: function(data) {
			}
		});

}
function pesan(hh){
	var cek = app.toast.create({
		text: hh,
		position: 'center',
		closeTimeout: 2000,
	});
	cek.open();
}

// api kinerja harian http://10.64.5.40/sikeren/api/lastActivity
