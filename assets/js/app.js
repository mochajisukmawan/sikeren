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
       url: api_url+"validation",
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
		 url: api_url+"uang_saku",
		 data: datas,
		 processData: false,
		 contentType: false,
		 success: function(data) {

			 $('.us').html("Rp "+rupiah(data.uang_saku)+",-");
			 $('.tp').html("Rp "+rupiah(data.t_penampilan)+",-");
			 $('.tbks').html("Rp "+rupiah(data.t_bpjs_kes)+",-");
			 $('.tbkn').html("Rp "+rupiah(data.t_bpjs_ktn)+",-");
			 $('.um').html("Rp "+rupiah(data.uang_makan)+",-");
			 $('.thp').html("Rp "+rupiah(data.take_home_pay)+",-");
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
		 url: api_url+"kehadiran",
		 data: datas,
		 processData: false,
		 contentType: false,
		 success: function(data) {
			 //console.log(data);
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
			url: api_url+""+jenis_absen+"",
			data: datas,
			processData: false,
			contentType: false,
			success: function(data) {
					//console.log(data);
					if(data.error == true){
						if(jenis_absen == 'absenPagi'){
							pesan(data.error_confirm);
							localStorage.setItem("coderating", data.coderating);
							//localStorage.setItem("kinerjaharian", JSON.stringify(data));
							app.router.navigate('/ratting/');
						}else{
							//console.log(data);
							if(data.status != 0){
								pesan(data.error_confirm);
								localStorage.setItem("kinerjaharian", JSON.stringify(data));
								app.router.navigate('/total-ratting/');
							}else{
								pesan(data.error_confirm);
							}

						}
					}else{
						if(jenis_absen == 'absenPagi'){
							data_pertanyaan = data.data;
							app.router.navigate('/absen-budaya/');
						}else{
							//console.log(data);
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

function change_raport(){
		app.preloader.show();
		var minggu = $('#raport-minggu').val();
		var session = JSON.parse(localStorage.getItem("session"));
		var kode_register = session.kode_register;
		var datas = new FormData();
		datas.append("nomor_register", kode_register);
		datas.append("minggu", minggu);
		$.ajax({
			 type: "POST",
			 url: api_url+"rapor",
			 data: datas,
			 processData: false,
			 contentType: false,
			 success: function(data) {
				 //console.log(data);
				 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				 var date = data.start.split("-");
				 var tanggal = date[2];
				 var bulan = date[1];
				 var tahun = date[0];
				 var date1 = data.end.split("-");
				 var tanggal1 = date1[2];
				 var bulan1 = date1[1];
				 var tahun1 = date1[0];
				 $("#tgl").html(''+tanggal+' '+months[bulan-1]+' '+tahun+' - '+tanggal1+' '+months[bulan-1]+' '+tahun1+'');
				 $(".Kedisiplinan").html(data.nilai_final.summary.kedisiplinan);
				 $(".ratting-nasabah").html(data.nilai_final.summary.rating);
				 $(".Produktifitas-Kerja").html(data.nilai_final.summary.produktivitas);
				 $(".standar-layanan").html(data.nilai_final.summary.budaya);
				 $(".nilai-raport-akhir").html(data.nilai_final.summary.total);
				 $("#na").html(data.nilai_final.summary.total);
				 app.preloader.hide();
			 },
			 error: function(data) {
			 }
		 });

}

function pesan(hh,position='center'){
	var cek = app.toast.create({
		text: hh,
		position: position,
		closeTimeout: 2000,
	});
	cek.open();
}

function biodata(){
	var session = JSON.parse(localStorage.getItem("session"));
	var no_reg = session.kode_register;
	var f_data = new FormData();
	f_data.append("nomor_register", no_reg);
	$.ajax({
		 type: "POST",
		 url: api_url+"biodata",
		 data: f_data,
		 processData: false,
		 contentType: false,
		 success: function(data) {
			$(".nama").html(session.nama_panggilan);
		 	$(".profile").attr('src', api_url+'preview_foto/'+session.nomor_register);
			$(".nm_lgkp").html(data["nama"]);
			$(".ktp").html(data["ktp"]);
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
			var date = data["tgl_lahir"].split("-");
			var bulan = date[1];
			$(".ttl").html(data["tempat"]+', '+date[2]+' '+months[bulan-1]+' '+date[0]);
			$(".agama").html(data["agama"]);
			$(".pemb").html(data["nama_pembimbing"]);
			$(".riwayat").html(data["last_riwayat_karir"]);
			$(".jabatan").html(data["jabatan"]);
			$(".uk").html(data["unit_kerja"]);
			//==
			$(".kd_reg").html(data["kode_register"]);
			$(".kd_teller").html(data["kode_teller"]);
			$(".norek").html(data["no_rekening"]);
			$(".no_npwp").html(data["no_npwp"]);
			$(".jenis").html(data["jenis"]);
			$(".tgl_masuk").html(data["tgl_masuk"]);
			app.preloader.hide();
		 },
		 error: function(data) {
		 }
	 });
}

function kinerja(){
	app.preloader.show();
	var session = JSON.parse(localStorage.getItem("session"));
	var no_reg = session.nomor_register;
	var f_data = new FormData();
	// penarikan tunai
	var jam_in,jam_out,pen_tunai,set_tunai,cnc,tgl;
	f_data.append("nomor_register", no_reg);
	$.ajax({
		 type: "POST",
		 url: api_url+"lastActivity",
		 data: f_data,
		 processData: false,
		 contentType: false,
		 success: function(data) {
			 console.log(data);
			 var cek=data.data.value_self_assessment;
			 if(cek.length<10){
				 jam_in		=data.data.self_assessment[0].jam_in;
				 jam_out	=data.data.self_assessment[0].jam_out;
				 tgl			=data.data.self_assessment[0].tanggal;
				 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	       var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
				 var date = tgl.split("-");
				 var bulan = date[1];
				 $("#kethari").html(''+date[2]+' '+months[bulan-1]+' '+date[0]+' ');
				 $("#transaksi").html(`<p>Anda belum melakukan absen sore</p>`);
				 if(data.rating != null)
	       {
	         var full_star = data.rating - (data.rating % 1);
	         var no = 0;
	         for(var i = 0 ; i < full_star ; i++){
	           no++;
	           $('.star_'+no+'').html('star_fill');
	         }
	         if(data.rating % 1 >= 0.5){
	           no++;
	           $('.star_'+no+'').html('star_half_fill');
	         }
	       }
				 //
			 }else {
				 //
				 jam_in		=data.data.self_assessment[0].jam_in;
				 jam_out	=data.data.self_assessment[0].jam_out;
				 tgl			=data.data.self_assessment[0].tanggal;
				 pen_tunai=data.data.value_self_assessment[10].nilai;
				 set_tunai=data.data.value_self_assessment[11].nilai;
				 cnc			=data.data.value_self_assessment[12].nilai;
				 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	       var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
				 var date = tgl.split("-");
				 var tanggal = date[2];
				 var bulan = date[1];
				 var tahun = date[0];
				 $("#kethari").html(''+tanggal+' '+months[bulan-1]+' '+tahun+' ');
				 $("#jam-in").html("Jam In : "+jam_in);
				 $("#jam-out").html("Jam Out : "+jam_out);
				 $("#pen_tunai").html("Transaksi Penarikan Tunai : "+pen_tunai);
				 $("#set_tunai").html("Transaksi Setoran Tunai : "+set_tunai);
				 $("#cnc").html("Transaksi Cancel (CNC) : "+cnc);
				 if(data.rating != null)
	       {
	         var full_star = data.rating - (data.rating % 1);
	         var no = 0;
	         for(var i = 0 ; i < full_star ; i++){
	           no++;
	           $('.star_'+no+'').html('star_fill');
	         }
	         if(data.rating % 1 >= 0.5){
	           no++;
	           $('.star_'+no+'').html('star_half_fill');
	         }
	       }
			 }
			 app.preloader.hide();

		 },
		 error: function(data) {
		 }
	 });
}

function informasi(jenis){
	console.log(jenis);
	var datas = new FormData(),datas1 = new FormData();
	var session = JSON.parse(localStorage.getItem("session"));
	var kode_register = session.kode_register;
	datas.append("kode_register", kode_register);
		$.ajax({
			 type: "POST",
			 url: api_url+"informasi/"+jenis[0],
			 data: datas,
			 processData: false,
			 contentType: false,
			 success: function(data) {
				 console.log(data);
				 for(var i in data){
					 var mulai_publish = data[i].mulai_publish.split(/[\s-]/);
					 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					 var date = ""+mulai_publish[2]+" "+months[mulai_publish[1]-1]+" "+mulai_publish[0];
					 //console.log(date);
					 $('.i_umum-cont').append(`<div class="card demo-card-header-pic">
																			 <div id="`+jenis[0]+`image-informasi`+i+`">
																			 </div>
																			<div class="card-content card-content-padding">
																				<p class="date">`+date+`</p>
																				<p class="header"><H3>`+data[i].judul+`</H3></p>
																				<p>`+data[i].short_desc+`</p>
																			</div>
																			<div class="card-footer">
																				<a href="#" class="link add-task-link popup-open" data-popup=".`+jenis[0]+`_add-task-popup_`+i+`">Read more</a>
																			</div>
																		</div>`);
						if(data[i].thumbnail != null){
							$('#'+jenis[0]+'image-informasi'+i+'').attr('style','background-image:url(http://10.64.5.40/sikeren/api/preview_image_informasi/'+data[i].thumbnail+')');
							$('#'+jenis[0]+'image-informasi'+i+'').attr('class','card-header align-items-flex-end');
						}
					}
					popup_info(data,jenis[0],date);
					app.preloader.hide();
			 },
			 error: function(data) {
			 }
		 });
	var nomor_register = session.nomor_register;
	datas1.append("nomor_register", nomor_register);
	$.ajax({
		 type: "POST",
		 url: api_url+"informasi/"+jenis[1],
		 data: datas1,
		 processData: false,
		 contentType: false,
		 success: function(data) {
			 console.log(data);
			 for(var i in data){
				 var mulai_publish = data[i].mulai_publish.split(/[\s-]/);
				 var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				 var date = ""+mulai_publish[2]+" "+months[mulai_publish[1]-1]+" "+mulai_publish[0];
				 //console.log(date);
				 $('.i_pribadi-cont').append(`<div class="card demo-card-header-pic">
																		 <div id="`+jenis[1]+`image-informasi`+i+`">
																		 </div>
																		<div class="card-content card-content-padding">
																			<p class="date">`+date+`</p>
																			<p class="header"><H3>`+data[i].judul+`</H3></p>
																			<p>`+data[i].short_desc+`</p>
																		</div>
																		<div class="card-footer">
																			<a href="#" class="link add-task-link popup-open" data-popup=".`+jenis[1]+`_add-task-popup_`+i+`">Read more</a>
																		</div>
																	</div>`);
					if(data[i].thumbnail != null){
						$('#'+jenis[1]+'image-informasi'+i+'').attr('style','background-image:url(http://10.64.5.40/sikeren/api/preview_image_informasi/'+data[i].thumbnail+')');
						$('#'+jenis[1]+'image-informasi'+i+'').attr('class','card-header align-items-flex-end');
					}
				}
				popup_info(data,jenis[1],date);
				app.preloader.hide();
		 },
		 error: function(data) {
		 }
	 });
}
function popup_info(data,jenis,date){
	//$(".popup").remove();
	for(var i in data){
		$('.tab').after(`
			<div class="popup `+jenis+`_add-task-popup_`+i+`">
					<div class="view popup-view">
							<div class="page">
									<div class="navbar">
											<div class="navbar-inner">
													<div class="left"><a href="#" class="link popup-close"><i class="fa fa-close"></i> <span>Close</span></a></div>
													<div class="title">Informasi Umum</div>
											</div>
									</div>
									<div class="page-content">
												<div class="tabs">
													<div class="tab tab-active" id="pro_overview">
															<div class="project-view">
																	<div class="card-box">
																			<h4 class="project-title">`+data[i].kepada+`</h4>
																			<div class="m-b-15">
																				 <span class="text-muted">Informasi</span>
																				 <span class="text-muted">`+jenis+`</span>
																				 <p>`+data[i].short_desc+`</p>
																			</div>
																	</div>
																	<div class="card-box">
																			<div class="sub-title">`+data[i].judul+`</div>
																			<p class="desc-cont text-muted">
																				<img src="`+api_url+`preview_image_informasi/sikeren.png" width="100%" height="100%" class="lazy lazy-fade-in demo-lazy"/>
																			</p>
																			<div class="due-date"><i class="fa fa-calendar"></i> <span>`+date+`</span></div>
																	</div>

																	<div class="card-box project-box">
																			<div class="pro-deadline m-b-15">
																					<div class="sub-title">
																							Pengumuman
																					</div>
																			</div>
																				`+data[i].pengumuman+`
																	</div>
															</div>
													</div>
												</div>
									</div>
							</div>
					</div>
			</div>
			`);
	}
}
function rupiah(bilangan){
	var	number_string = bilangan.toString(),
	sisa 	= number_string.length % 3,
	rupiah 	= number_string.substr(0, sisa),
	ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
	if (ribuan) {
		separator = sisa ? '.' : '';
		rupiah += separator + ribuan.join('.');
	}
	return rupiah;
}

function notifikasi(){
	var no_reg = JSON.parse(localStorage.getItem("session"));
	no_reg=no_reg.nomor_register;
	var f_data = new FormData();
	f_data.append("nomor_register", no_reg);
	$.ajax({
		 type: "POST",
		 url: api_url+"informasi/notifunread",
		 data: f_data,
		 processData: false,
		 contentType: false,
		 success: function(data) {
				//console.log(data[0].informasi_unread);
				if(data[0].informasi_unread>0){
					$(".notif").html('notifications<span class="badge color-red bg">'+data[0].informasi_unread+'</span>');
					$(".isi-notif").attr('href', '/notifikasi/');
					var jenis=["umum","pribadi",data[0].informasi_unread];

				}else {
					$(".notif").html("notifications");
					$(".bg").remove();
					//$(".isi-notif").attr('href', '/notifikasi/');
					//app.router.navigate('/notifikasi/');
				}
		 },
		 error: function(data) {
		 }
	 });
}
function dialog(title="",text="",callbackyes,callbackno){
  app.dialog.create({
      title: title,
      text: text,
      buttons: [{
              text: 'No',
              onClick: callbackno
          },
          {
              text: 'Yes',
              onClick: callbackyes
          }
      ],
      verticalButtons: false,
  }).open();
};
function geolocation(){
	if (navigator.geolocation) {
		var res = {};
		var options = {
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
		};
    navigator.geolocation.getCurrentPosition(function(position){
				$.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyAigUXwdBTeeNNYgmFBhnKcUGxViyZasq8&sensor=true",function(data,status){
					if(status=="success" && data.status == "OK"){
						res = {
							"lat":position.coords.latitude,
							"long":position.coords.longitude,
							"address":data.results[0].formatted_address
						};
						return res;
					}else{
						res = {
							"lat":position.coords.latitude,
							"long":position.coords.longitude,
							"address":"Alamat tidak terdeteksi"
						};
						return res;
					}
				}).fail(function(response){
					res = {
						"lat":position.coords.latitude,
						"long":position.coords.longitude,
						"address":"Alamat tidak terdeteksi"
					};
					return res;
				});
		}, function(error){
			switch(error.code) {
		    case error.PERMISSION_DENIED:
  				pesan("User denied the request for Geolocation.","top",4000);
		      break;
		    case error.POSITION_UNAVAILABLE:
					pesan("Location information is unavailable.","top",4000);
		      break;
		    case error.TIMEOUT:
				  pesan("The request to get user location timed out.","top",4000);
		      break;
		    case error.UNKNOWN_ERROR:
					pesan("An unknown error occurred","top",4000);
		      break;
		  }
			res = {
				"lat":0,
				"long":0,
				"address":"Alamat tidak terdeteksi"
			};
			return res;
		},options);
  } else {
    pesan("Not Support Geo Navigator, Update Your Browser","top",4000);
		res = {
			"lat":0,
			"long":0,
			"address":"Alamat tidak terdeteksi"
		};
		return res;
  }
}
