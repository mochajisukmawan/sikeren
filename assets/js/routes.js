var routes = [
{
  path: '/',
  url: './index.html',
  on: {
      pageBeforeIn: function(event, page) {
        console.log("index befioe in");
      },
      pageAfterIn: function(event, page) {
        console.log("index after in");
      },
      pageInit: function(event, page) {
        authenticate(function(data){
          var app = page.app
          app.router.navigate('/login/');
        });
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
  path: '/login/',
  url: './pages/login.html',
},
{
  path: '/menu-absen/',
  url: './pagesikeren/absen/menu-absen.html',
  async(routeTo, routeFrom, resolve, reject) {
    is_login(function(){
      resolve({ url: 'pages/login.html' });
    });
  },
  on: {
      pageBeforeIn: function(event, page) {
        console.log("index before in");
      },
      pageAfterIn: function(event, page) {
        console.log("index after in");
      },
      pageInit: function(event, page) {
        console.log("index in");
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
  path: '/absen-pagi/',
  url: './pagesikeren/absen/absen-pagi.html',
  async(routeTo, routeFrom, resolve, reject) {
    is_login(function(){
      resolve({ url: 'pages/login.html' });
    });
  },
  on: {
      pageBeforeIn: function(event, page) {
        console.log("index before in");
      },
      pageAfterIn: function(event, page) {
        var d = new Date();
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        $("#kethari").html(days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear()+" Pukul : "+d.getHours()+":"+d.getMinutes());
      },
      pageInit: function(event, page) {
        console.log("index in");
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
  path: '/absen-sore/',
  url: './pagesikeren/absen/absen-sore.html',
},
{
  path: '/uang-saku/',
  url: './pagesikeren/uangsaku/uang-saku.html',
  async(routeTo, routeFrom, resolve, reject) {
    is_login(function(){
      resolve({ url: 'pages/login.html' });
    });
  },
  on: {
      pageBeforeIn: function(event, page) {
        console.log("index before in");
      },
      pageAfterIn: function(event, page) {
        app.preloader.show();
         var tanggal_us = $('#waktu').val();
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
        			 app.preloader.hide();
        			 $('.us').html("Rp "+data.uang_saku);
        			 $('.tp').html("Rp "+data.t_penampilan);
        			 $('.tbks').html("Rp "+data.t_bpjs_kes);
        			 $('.tbkn').html("Rp "+data.t_bpjs_ktn);
        			 $('.um').html("Rp "+data.uang_makan);
        			 $('.thp').html("Rp "+data.take_home_pay);
        		 },
        		 error: function(data) {
        		 }
        	 });
      },
      pageInit: function(event, page) {
        var no_registrasi = new FormData();
        var session = JSON.parse(localStorage.getItem("session"));
        var nomor_register = session.nomor_register;
        no_registrasi.append("nomor_register", nomor_register);
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          $.ajax({
             type: "POST",
             url: "http://10.64.5.40/sikeren/api/uang_saku_bydate",
             data: no_registrasi,
             processData: false,
             contentType: false,
             success: function(data) {
                var periode = data.periode;
                for(var i in periode){
                  var date = periode[i].periode.split("-");
                  var tahun = date[0];
                  var bulan = date[1]
                  $("#waktu").append('<option value="'+periode[i].periode+'">'+months[bulan-1]+" "+tahun+'</option>');
                }

             },
             error: function(data) {
             }
           });
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
  path: '/kehadiran/',
  url: './pagesikeren/kehadiran/kehadiran.html',
},
{
  path: '/raport/',
  url: './pagesikeren/raport/raport.html',
},
{
  path: '/kinerja-harian/',
  url: './pagesikeren/kinerjaharian/kinerja-harian.html',
}
];
