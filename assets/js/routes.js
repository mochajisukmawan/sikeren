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
        var session = JSON.parse(localStorage.getItem("session"));
        $("#nama").html(session.nama_panggilan);
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
  path: '/login/',
  url: './pagesikeren/login.html',
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
        var apps = page.app;
        var dataurlimage;
        var d = new Date();
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        $("#kethari").html(days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear()+" Pukul : "+d.getHours()+":"+d.getMinutes());
         var vidw=parseInt($('#video').width());
         $('.absenpagi').on('click',function(){
           $('#div_canvas').html('<canvas id="canvas" width="'+vidw+'" height="385"></canvas>');
            try{
              var context = document.getElementById('canvas').getContext('2d');
              var video = document.getElementById('video');
              context.drawImage(video, 0,0,vidw,385);
              dataurlimage=document.getElementById('canvas').toDataURL("image/png");
            }catch(e){
              console.log('We have encountered an error: ' + e);
            }
        });
        console.log(data_pertanyaan);
        for(var i in data_pertanyaan){
          $('.div_pertanyaan').append(`
                  <div class="row">
        						<div class="col-100 tablet-100">
        							<div class="card no-margin justify-content-center">
        							  <div class="card-content card-content-padding">
        									<p class="block-strong no-margin-bottom">`+data_pertanyaan[i].quisioner+`</p>
        									 <p class="no-margin-top text-align-center block-strong">
        										<label class="radio">
        											<input type="radio" value="`+data_pertanyaan[i].jawaban_ya+`" name="quisioner_`+data_pertanyaan[i].id_quisioner+`"><i class="icon-radio"></i>
        										</label> <b>`+data_pertanyaan[i].jawaban_ya+`</b>
        										&nbsp;&nbsp;
        										<label class="radio margin-left">
        											<input type="radio" value="`+data_pertanyaan[i].jawaban_tidak+`" name="quisioner_`+data_pertanyaan[i].id_quisioner+`"><i class="icon-radio"></i>
        										</label> <b>`+data_pertanyaan[i].jawaban_tidak+`</b>
        									</p>
        								</div>
        							</div>
        						</div>
        					</div>`);

      }
      $('.presensi_pagi').on('click',function(){
        app.preloader.show();
        var session = JSON.parse(localStorage.getItem("session"));
        var nomor_register = session.nomor_register;
        var validasi = 0;
       	var datas = new FormData();
        datas.append("nomor_register", nomor_register);
        datas.append("selfie_pagi", dataurlimage);
        for(var k in data_pertanyaan){
          var value = $('input[name="quisioner_'+data_pertanyaan[k].id_quisioner+'"]:checked').val();
          if(value == null){
            validasi++;
          }
          datas.append(data_pertanyaan[k].id_quisioner , value);
        }
        if(validasi == 0){
          $.ajax({
             type: "POST",
             url: "http://10.64.5.40/sikeren/api/simpanAbsenPagi",
             data: datas,
             processData: false,
             contentType: false,
             success: function(data) {
                app.preloader.hide();
                absen_pagi_berhasil.open();
                $('.page-previous').remove();
                // barcode
                localStorage.setItem("coderating", data.coderating);
                // get custom tanggal
                // page
                apps.router.navigate('/ratting/');
                $('.my-popup').attr("class","popup my-popup");
                $('.my-popup').remove();
                $('.popup-backdrop').attr('class', 'popup-backdrop');
                // $('.back').attr('onClick', "'setbackmenu()'");
             },
             error: function(data) {
              app.preloader.hide();
              absen_pagi_gagal.open();
             }
           });
       }else{
         app.preloader.hide();
         isi_semua.open();
       }

      });

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
        cari_us();
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
                  $("#waktu_us").append('<option onClick="cari_us()" value="'+periode[i].periode+'">'+months[bulan-1]+" "+tahun+'</option>');
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
        cari_kehadiran();
      },
      pageInit: function(event, page) {
        var no_registrasi = new FormData();
        var session = JSON.parse(localStorage.getItem("session"));
        var nomor_register = session.nomor_register;
        no_registrasi.append("nomor_register", nomor_register);
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          $.ajax({
             type: "POST",
             url: "http://10.64.5.40/sikeren/api/kehadiran_bydate",
             data: no_registrasi,
             processData: false,
             contentType: false,
             success: function(data) {
               // $("#waktu").append('<option value="" hidden>Tanggal</option>');
                var periode = data.periode;
                console.log(periode);
                for(var i in periode){
                  var date = periode[i].periode.split("-");
                  var tahun = date[0];
                  var bulan = date[1]
                  $("#waktu_kehadiran").append('<option value="'+periode[i].periode+'">'+months[bulan-1]+" "+tahun+'</option>');
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
  path: '/raport/',
  url: './pagesikeren/raport/raport.html',
},
{
  path: '/kinerja-harian/',
  url: './pagesikeren/kinerjaharian/kinerja-harian.html',
},
{
  path: '/budaya/',
  url: './pagesikeren/budaya/budaya.html',
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
        //app.preloader.show();
        // cari_kehadiran();
      },
      pageInit: function(event, page) {
        var no_registrasi = new FormData();
        var session = JSON.parse(localStorage.getItem("session"));
        var nomor_register = session.nomor_register;
        no_registrasi.append("nomor_register", nomor_register);
          $.ajax({
             type: "POST",
             url: "http://10.64.5.40/sikeren/api/budaya",
             data: no_registrasi,
             processData: false,
             contentType: false,
             success: function(data) {
               console.log(data);
               for(var i in data){
               $('.budaya-cont').append(`
                                       <div class="card card-outline">
                                         <div class="card-header">`+data[i].std_layanan+`</div>
                                         <div class="card-content card-content-padding">
                                         <div class="list accordion-list">
                                           <ul class="`+data[i].id_std_layanan+`">

                                           </ul>
                                         </div>
                                         </div>
                                         <div class="card-footer"><h3>Bobot : `+data[i].bobot+`</h3></div>
                                       </div>
                                      `);
                  var detail_layanan = data[i].detail_layanan;
                  for(var j in detail_layanan){
                    var no = Number(j) + 1;
                    $('.'+data[i].id_std_layanan+'').append(`
                      <li class="accordion-item"><a href="#" class="item-content item-link">
                          <div class="item-inner">
                            <div class="item-title"><h5>`+no+`. `+detail_layanan[j].std_layanan_detail+`</h5></div>
                          </div></a>
                        <div class="accordion-item-content">
                          <div class="block   detail_layanan_sekali_`+detail_layanan[j].id_std_layanan_detail+`">
                          </div>
                        </div>
                      </li>

                      `);
                    var detail_layanan_sekali = detail_layanan[j].detail_layanan_sekali;
                    for(var k in detail_layanan_sekali){
                      var no_lay = Number(k) + 1;
                      $('.detail_layanan_sekali_'+detail_layanan[j].id_std_layanan_detail+'').append('<p>'+no_lay+'. '+detail_layanan_sekali[k].std_layanan_detail_sekali+'</p>');
                    }
                  }
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
  path: '/before-abs/',
  url: './pagesikeren/absen/before-abs.html',
},
{
  path: '/informasi/',
  url: './pagesikeren/informasi/informasi.html',
},{
  path: '/perjanjian/',
  url: './pagesikeren/perjanjian/perjanjian.html',
  on: {
      pageBeforeIn: function(event, page) {
        console.log("index before in");
      },
      pageAfterIn: function(event, page) {
        console.log("index after in");
      },
      pageInit: function(event, page) {
        var no_registrasi = new FormData();
        var session = JSON.parse(localStorage.getItem("session"));
        var kode_register = session.kode_register;
        $('#pdf_perjanjian').attr('src','http://10.64.5.40/sikeren/api/preview_file/'+kode_register+'');
      },
      pageBeforeRemove: function(event, page) {
        console.log("index before leave");
      },
  }
},
{
path: '/absen-budaya/',
url: './pagesikeren/absen/absen-budaya.html',
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
      //app.preloader.show();
      // cari_kehadiran();
    },
    pageInit: function(event, page) {
      var no_registrasi = new FormData();
      var session = JSON.parse(localStorage.getItem("session"));
      var nomor_register = session.nomor_register;
      no_registrasi.append("nomor_register", nomor_register);
        $.ajax({
           type: "POST",
           url: "http://10.64.5.40/sikeren/api/budaya",
           data: no_registrasi,
           processData: false,
           contentType: false,
           success: function(data) {
             console.log(data);
             for(var i in data){
               var no_judul = Number(i) + 1;
               $('.budaya-cont').append(`
               <div class="card card-outline div_judul_`+no_judul+`" style="display:none">
                 <div class="card-header"><h3>`+data[i].std_layanan+`</h3></div>
                 <div class="card-content card-content-padding">
                 <div class="list accordion-list">
                   <ul class="`+data[i].id_std_layanan+`">
                   </ul>
                 </div>
                 </div>
               </div>
              `);
              var detail_layanan = data[i].detail_layanan;
              for(var j in detail_layanan){
                var no_subjudul = Number(j) + 1;
                $('.'+data[i].id_std_layanan+'').append(`
                  <li class="accordion-item div_judul_`+no_judul+`_subjudul_`+no_subjudul+`" style="display:none"><a href="#" class="item-content">
                      <div class="item-inner">
                        <div class="item-title"><h4 style="color:black">`+no_subjudul+`. `+detail_layanan[j].std_layanan_detail+`</h4></div>
                      </div></a>
                    <div class="">
                      <div class="block   detail_layanan_sekali_`+detail_layanan[j].id_std_layanan_detail+`">
                      </div>
                    </div>
                  </li>
                `);
                  var detail_layanan_sekali = detail_layanan[j].detail_layanan_sekali;
                  for(var k in detail_layanan_sekali){
                    var no_lay = Number(k) + 1;
                    $('.detail_layanan_sekali_'+detail_layanan[j].id_std_layanan_detail+'').append('<p>'+no_lay+'. '+detail_layanan_sekali[k].std_layanan_detail_sekali+'</p>');
                  }
                }
              }

              $('.budaya-cont').append(`<div class="block">
                                  				<div class="account-form margin-top">
                                  					<div class="input-list">
                                              <button class="button account-btn " type="button" id="next_id">Next</button>
                                            </div>
                                          </div>
                                        </div>`);


               var judul = 1;
               var subjudul = 1;
               $('.div_judul_'+judul+' , .div_judul_'+judul+'_subjudul_'+subjudul+'').attr('style','display:block');
               $('#next_id').on("click",function(){
                 $('.div_judul_'+judul+' , .div_judul_'+judul+'_subjudul_'+subjudul+'').attr('style','display:none');
                 subjudul++;
                 if($('.div_judul_'+judul+'_subjudul_'+subjudul+'').length) {
                   $('.div_judul_'+judul+' , .div_judul_'+judul+'_subjudul_'+subjudul+'').attr('style','display:block');
                 }else{
                   judul++;
                   if($('.div_judul_'+judul+'').length){
                     subjudul = 1;
                     $('.div_judul_'+judul+' , .div_judul_'+judul+'_subjudul_'+subjudul+'').attr('style','display:block');
                   }else{
                     $('#next_id').hide();
                     app.router.navigate('/absen-pagi/');

                   }
                 }
               });
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
path: '/ratting/',
url: './pagesikeren/absen/ratting.html',
on: {
    pageBeforeIn: function(event, page) {
      console.log("index before in");
    },
    pageAfterIn: function(event, page) {
      //app.preloader.show();
      // cari_kehadiran();
    },
    pageInit: function(event, page) {
      var coderatting = localStorage.getItem("coderating");
      console.log(coderatting);
      var d = new Date();
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      console.log(days[d.getDay()]);
      $(".tgl").html("<b>Scan Barcode </b><br>"+days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear()+" Pukul : "+d.getHours()+":"+d.getMinutes());
      var vidw=parseInt($('#video').width());

      $('#barcode').attr('src','https://chart.googleapis.com/chart?cht=qr&chl=https://eoffice.bankjateng.co.id/html/rating/masuk/'+coderatting+'&chs=200x200&chld=H|3');

    },
    pageBeforeRemove: function(event, page) {
      console.log("index before leave");
    },
  }
}


];
