define(['jquery'], function($){
    var CustomWidget = function () {
		//===============================================
		//виджет для импорта данных в AMO CRM 
		//весь код работает по кнопке id=#importhtml
		//===============================================
    	var self = this;
    	var ddnumber;
		var daynum;
		var monthnum;
		var yearnum;
		var datestamp;
		


		this.callbacks = {
			render: function(){
				//console.log('render'); test 7zip
				w_code = self.get_settings().widget_code; //в данном случае w_code='new-widget'
				var template = '<div><div class="whitebackground"><div class="widgetback1">'+
					'<p>Для импорта заявки из личного кабинета amoCRM проделайте следующие шаги:</p>'+
					'<p>1. Перейдите по этой ссылке <a href="#">(ссылка на ЛК)</a></p>'+					
					'<p>2. Скопируйте ссылку из адресной строки в поле ниже и нажмите "Добавить"</p>'+
					'</div><hr>'+
					'<textarea id="linkfieldu" class="widgetta1"></textarea><br />'+
					'<input type="checkbox" class="widgetcheckclass1" id="proxychecku" value="1" checked hidden>'+	
                    '<center><button class="button-input" class="widgetbutton1" id="importhtmlu">Загрузить</button></center>'+											
					'</div>'+
                    '<div id="parsehtml"></div>'+
                    '</div>'+
					'<link type="text/css" rel="stylesheet" href="/upl/'+w_code+'/widget/style.css" >';

                self.render_template({
                    caption:{
                        class_name:'js-ac-caption',
                        html:''
                    },
                    body:'',
                    render :  template
                });
				//простановка версии виджета в div id=#parsehtml
				$jsonurl = '/upl/'+w_code+'/widget/manifest.json';
				$.getJSON( $jsonurl, function( data ) {
					vers19011 = data.widget.version;
					$('#parsehtml').html('v.'+vers19011);					
				});
				return true;
			},
			init: function(){
				console.log('Init:');
				return true;
			},
			bind_actions: function(){
				$('#importhtmlu').on('click', function(){
					self.callbacks.getData();
					// ====================================================
					// =======параметры виджета============================
					// ====================================================
					// домен аккаунта
					striddomain = "new569657cfe698c";
					//время ожидания после нажатия на кнопку сохранить в мс 2000=2сек
					timervalue = 3000; 
					// id полей для импорта
					//var idtags = [ "CONTACT_NAME", "CONTACT_EMAIL", "CONTACT_PHONE", "CONTACT_COMPANY", "BRIEF_BRANCH", "BRIEF_SPECIALIZATION", "BRIEF_ROUGH_COST", "BRIEF_TIME_LIMIT", "BRIEF_COMMENT" ];
					var idtags = [ "CONTACT_NAME", "CONTACT_EMAIL", "CONTACT_PHONE", "CONTACT_COMPANY", "BRIEF_BRANCH", "BRIEF_SPECIALIZATION", "BRIEF_ROUGH_COST", "BRIEF_COMMENT" ];
					// id полей в АМО
					// сущность ответсвенный пользователь==================					
					struser1id = "680745";
					struser2id = "513807";
					rndval = Math.round(Math.random());
					if (rndval == 0) {respuserid = struser1id} else {respuserid = struser2id}
					// сущность контакт====================================
					// "CONTACT_NAME"
					stridcontactname = "contact[NAME]";
					// "CONTACT_EMAIL"
					stridcontactemail = "861028";
					// "CONTACT_PHONE"
					stridcontactph = "861026";
					// "CONTACT_COMPANY" - в сущность компания=============
					// нет параметра
					// имя услуги
					stridcompanbranch = "885097";
					// Описание услуги
					stridcompanspec = "885099";
					// Чек бокс импорт
					stridcompancheckbox = "885101";
					// сущность сделка=====================================
					// "Имя сделки"
					strleadname = 'Сделка(импорт) '+self.datestamp;
					// "BRIEF_BRANCH"
					stridbriefbranch = "861116";
					// "BRIEF_SPECIALIZATION"
					strbriefspec = "861118";
					// "BRIEF_ROUGH_COST"
					stridbriefrough = "861122";
					// "BRIEF_TIME_LIMIT"
					stridbrieftime = "861120";
					// "статус сделки - 10060455 новая"
					stridlead = '10060455';
					// галочка импорт
					stridcheckbox = '884333';
					// сущность Примечание к сделке========================
					// "BRIEF_COMMENT"
					// нет параметра					
					// прокси url с авторизацией
					strurlproxy = 'http://rsdim.dlinkddns.com/trace/post1/post1.php';
					// ===конец параметров==================================
					
					
					console.log('Start-OnClick-importhtml:');
					htmlvar = { res: $('#linkfieldu').val()}		
					
					
					if ($('#linkfieldu').val()==="") {
						alert("Адрес не может быть пустой строкой");
					} else {
						//обработка input
						$('#parsehtml').hide();
						console.log("gethtml start linkfieldu:" + $('#linkfieldu').val());
						
						if ($("#proxychecku").prop("checked")) {
							adress = strurlproxy;
						} else {
							adress = $('#linkfieldu').val();							
						}
						console.log("adress qqq:"+adress);
						self.crm_post (
							adress,
							htmlvar,
							function(data) {
								//подрезка строчки
								datastr = "" + data;
								//console.log( 'datastr:'+ datastr);
								pos1 = datastr.indexOf('<body>')+6;
								pos2 = datastr.indexOf('</body>');
								console.log( 'Pos1:'+pos1 +' Pos2:'+pos2);
								data2 = datastr.slice(pos1,pos2);
								//чистим js тэги
								data3 = data2.replace(/script/g,"")
								//console.log( 'data3:'+ data3);
								//console.log( 'data3:==============================');
								$('#parsehtml').html(data3);
								
								itexts = "";
								itextsid = "";
								arritexts = [];
								arritextsid = [];
								console.log( 'each1' );
								$('#parsehtml').each(function(){
									console.log( 'each2' );
									//получаем все input внутри div
									$(this).find($( ":input" )).each(function(){	
										//фильтр в цикле
										currentid = ""+$(this).attr("id");
										for (var k14 = 0; k14 < idtags.length; k14++) {
											tmpk = ""+ idtags[k14];
											if (tmpk==currentid) {
												cval = ""+$(this).val();
												cid = ""+$(this).attr("id");
												itextsid = itextsid+cid+"!-!";									
												itexts = itexts+cval+"!-!";
												arritexts.push(cval);
												arritextsid.push(cid);
											}
										}
									});	
									//===все textarea======
									$(this).find($( "textarea" )).each(function(){	
										//фильтр в цикле
										currentid = ""+$(this).attr("id");
										for (var k14 = 0; k14 < idtags.length; k14++) {
											tmpk = ""+ idtags[k14];
											if (tmpk==currentid) {
												cval = ""+$(this).val();
												cid = ""+$(this).attr("id");
												itextsid = itextsid+cid+"!-!";									
												itexts = itexts+cval+"!-!";
												arritexts.push(cval);
												arritextsid.push(cid);
											}
										}
									});	
								});					
								//console.log( 'arritextsid:'+arritextsid.join("---") );		
								//console.log( 'arritexts:'+arritexts.join("---") );
								//=========================================
								//$('input[name="MAIN_ID"]').is
								currentleadid = ""+$('input[name="MAIN_ID"]').val();
								console.log( 'currentleadid:'+currentleadid);
								
								//генерация responsible id
								//создание контакта 
								flag15 = "";
								contacts1 = "";
								emailsarr = [];
								emails = "";
								phonesarr = [];
								phones = "";
								contactname = "";
								branch1 = "";
								spec1 = "";
								rough1 = "";
								time1 = "";
								arrtime1 = [];
								compan1 = "";
								arrcomment1 = [];
								for (var k14 = 0; k14 < arritextsid.length; k14++) {
									//данные контакта
									if (arritextsid[k14]=='CONTACT_EMAIL') {
										flag15 = "1";
										emailsarr.push(arritexts[k14]);
										//emails = emails+arritexts[k14]+',';
									}
									if (arritextsid[k14]=='CONTACT_PHONE') {
										flag15 = "1";
										phonesarr.push(arritexts[k14])
										//phones = phones+arritexts[k14]+',';
									}
									//CONTACT_NAME
									if (arritextsid[k14]=='CONTACT_NAME') {										
										contactname = arritexts[k14];
									}
									//данные сделки									
									if (arritextsid[k14]=='BRIEF_ROUGH_COST') {
										rough1 = arritexts[k14];
									}
									if (arritextsid[k14]=='BRIEF_TIME_LIMIT') {
										//time1 = time1+arritexts[k14];
										arrtime1.push(arritexts[k14]);
									}
									//данные компании
									if (arritextsid[k14]=='CONTACT_COMPANY') {
										compan1 = ""+arritexts[k14];
									}
									if (arritextsid[k14]=='BRIEF_BRANCH') {												
										branch1 = arritexts[k14];
									}
									if (arritextsid[k14]=='BRIEF_SPECIALIZATION') {
										spec1 = arritexts[k14];
									}
									//данные примечания
									if (arritextsid[k14]=='BRIEF_COMMENT') {
										//comment1 = comment1+arritexts[k14]+',';
										arrcomment1.push(arritexts[k14]);
									}
								}	
								
								
								//создание сделок 10060455 -первичнй контакт 142 - успешно реализовано
								
								emails = emailsarr.join();
								phones = phonesarr.join();
								time1 = arrtime1.join();
								//имя сделки lead[NAME]
								console.log( 'lead[NAME]:'+strleadname);
								$('input[name="lead[NAME]"]').val(strleadname);
								//имя услуги		
								//console.log( 'CFV '+stridbriefbranch+':'+branch1);
								//$('input[name="CFV['+stridbriefbranch+']"]').val(branch1);
								//описание услуги								
								//console.log( 'CFV '+strbriefspec+':'+spec1);
								//$('input[name="CFV['+strbriefspec+']"]').val(spec1);
								//ор стоимость
								console.log( 'CFV '+stridbriefrough+':'+rough1);
								//$('input[name="CFV['+stridbriefrough+']"]').val(rough1);
								//дата
								//console.log( 'CFV '+stridbrieftime+':'+time1);
								//$('input[name="CFV['+stridbrieftime+']"]').val(time1);
								//галочка ИМПОРТ
								console.log( 'CFV '+stridcheckbox+':checked');
								$('input[name="['+stridcheckbox+']"]').checked;
								self.callbacks.updateDocument("");
								
								
								//данные контакта
								//имя контакта contactname
								//console.log( 'CFV '+stridcontactname+':'+contactname);
								//$('input[name="'+stridcontactname+'"]').val(contactname);
								//email
								//console.log( 'CFV['+stridcontactemail+'][bN6r8NtnTz][VALUE]:'+emails);
								//$('input[name="CFV['+stridcontactemail+'][bN6r8NtnTz][VALUE]"]').val(emails);
								//phone
								//console.log( 'input[name="CFV[861026]"]:'+phones);
								//$('input[name="CFV[861026]"]').val(phones);
								
								//данные компании company[NAME]
								//console.log( 'name="company[NAME]:'+compan1);
								//$('input[name="company[NAME]"]').val(compan1);
								
								
								
								//нажимаем последовательно Добавить контакт и Сохранить
								
								
								setTimeout(function(){
									//примечание js-note-add-textarea
									console.log( 'js-note-add-textarea:'+arrcomment1.join());
									$('.note-edit__body > textarea').trigger('focusin').val(arrcomment1.join());									
									self.callbacks.updateDoc2("");
								},
								timervalue);
								//тормознем для проверки
								//return false;
								setTimeout(function(){
										//ждем 1 секунду и продолжаем
										currentleadid = ""+$('input[name="lead_id"]').val();
										console.log( 'currentleadid2.1:'+currentleadid);
										//====Внутри таймера=====================================
										
										if (flag15 == "1") {
											//861026 - id телефона 861028-id email
											if (emails=="") { } else {
												contacts1 = '{"id":'+stridcontactemail+',"values":[{"value":"'+emails+'","enum":"WORK"}]}';
											}
											if (emails=="" || phones=="") {} else {
												contacts1 = contacts1 + ',';
											}
											if (phones=="") {} else {
												contacts1 = contacts1 + '{"id":'+stridcontactph+',"values":[{"value":"'+phones+'","enum":"WORK"}]}';
											}									
											contacts1 = ',"custom_fields":  ['+contacts1+']';
									
										}
										if (contactname=="") {
											contactname = "Контакт не указан";
										}
										contacts1 = '{"name":"'+contactname+'","linked_leads_id":['+currentleadid+'],"responsible_user_id":"'+respuserid+'"'+contacts1+'}';
										contacts1 = '{"request":{"contacts":{"add":['+contacts1+']}}}';
										contactdata = JSON.parse(contacts1);
										console.log( 'contacts:'+contacts1 );
										userid = "";
										$.post(
											"https://"+striddomain+".amocrm.ru/private/api/v2/json/contacts/set",
											contactdata,
											function( msgdata ) {
												//получаем id созданного контакта
												console.log( 'contactdata:'+JSON.stringify(msgdata) );
												cdata15 = JSON.parse(JSON.stringify(msgdata));
												userid = ""+cdata15.response.contacts.add[0].id;
												srvtime = parseInt(cdata15.response.server_time);
												console.log( 'srvtime:'+srvtime );
												stime = srvtime+1;
												//==Делаем update связанной сделки
												
												//leads1 = '{"id":"'+currentleadid+'","responsible_user_id":"'+respuserid+'","status_id":'+stridlead+leads1+'}';
												//leads1 = '{"request":{"leads":{"add":['+leads1+']}}}';
												//console.log('leads1:'+leads1);
												//leaddata = JSON.parse(leads1);
												//$.post(
												//	"https://"+striddomain+".amocrm.ru/private/api/v2/json/leads/set",
												//	leaddata,
												//	function( leadres ) {
												//		console.log( 'leadres:'+JSON.stringify(leadres) );
												//	},
												//	"json"
												//);
												//==Создаем связанную компанию
												//компания
													updatecontactdatastr = '{"request":{"contacts":{"update":[{"id":"'+userid+'","linked_leads_id":["'+currentleadid+'"],"last_modified":"'+stime+'"}]}}}';
													console.log('update contact:'+updatecontactdatastr);
													updatecontactdata = JSON.parse(updatecontactdatastr);
													$.post(
														"https://"+striddomain+".amocrm.ru/private/api/v2/json/contacts/set",
														updatecontactdata,
														function( upddata ) {
															console.log( 'upddata:'+JSON.stringify(upddata) );
															//создание компании при успешном апдейте
															srvtime = parseInt(upddata.response.server_time);																														
															compname = compan1.replace(/"/g,"'");															
															console.log( 'srvtime3:'+srvtime );
															if (compan1=="") { 
																console.log( 'compan1=0' );
															}
															else {
																compan1 = ',"custom_fields":[{"id":"'+stridcompanbranch+'","values":[{"value":"'+branch1+'"}]},{"id":"'+stridcompanspec+'","values":[{"value":"'+spec1+'"}]},{"id":"'+stridcompancheckbox+'","values":[{"value":"1"}]}]';
																compan1 = '{"name":"'+compname+'","responsible_user_id":"'+respuserid+'","linked_leads_id":["'+currentleadid+'"]'+compan1+'}';
																compan1 = '{"request":{"contacts":{"add":['+compan1+']}}}';																
																compandata = JSON.parse(compan1);
																console.log( 'compan1:'+JSON.stringify(compandata) );
																setTimeout(function() {window.location.reload();}, 1500);
																$.post(
																	"https://"+striddomain+".amocrm.ru/private/api/v2/json/company/set",
																	compandata,
																	function( cmpdata ) {
																		//update контакта при создании компании
																		console.log( 'compandata:'+JSON.stringify(cmpdata) );
																		companid15 = JSON.parse(JSON.stringify(cmpdata));
																		companid = ""+companid15.response.contacts.add[0].id;
																		srvtime = parseInt(companid15.response.server_time);
																		console.log( 'srvtime4:'+srvtime );
																		stime = new Date().getTime();
																		stime = Math.round(stime/1000)+20;
																		stime = srvtime+2;
																		
																		updatecontactdatastr = '{"request":{"contacts":{"update":[{"id":"'+userid+'","company_name":"'+compname+'","last_modified":"'+stime+'"}]}}}';
																		console.log( 'updcontact2.1:'+updatecontactdatastr );
																		updatecontactdata = JSON.parse(updatecontactdatastr);
																		$.post(
																			"https://"+striddomain+".amocrm.ru/private/api/v2/json/contacts/set",
																			updatecontactdata,
																			function( updcontact2 ) {
																				console.log( 'updcontact2.2:'+JSON.stringify(updcontact2) );
																				
																			},
																			"json"
																		);
																	},
																	"json"
																);
															}
															//===компания===============
														},
														"json"
													);
										
										
											},
											"json"
										);
										//=======================================================
									},timervalue*2);	
								//далее не продолжаем
								
							},
							'text'
						);
						
			
					}					
					console.log('Finish-OnClick-importhtml');

				});

				//console.log(self.system().area);


				return true;
			},
			settings: function(){

				return true;
			},
			onSave: function(){

				return true;
			},
			destroy: function(){

			},
			contacts: {
					//select contacts in list and clicked on widget name
					selected: function(){

					}
				},
			leads: {
					//select leads in list and clicked on widget name
					selected: function(){

					}
				},
			tasks: {
					//select taks in list and clicked on widget name
					selected: function(){

					}
				},
			getData: function(){
					console.log('StartGetData');					
					var today = new Date();
					self.mins = "" + today.getMinutes();
					self.hour = "" + today.getHours();
					self.daynum = "" + today.getDate();
					self.monthnum = "" + (today.getMonth()+1); //January is 0!
					self.yearnum = "" + today.getFullYear();	
					self.datestamp = "" + today.getFullYear() + "-"+(today.getMonth()+1)+"-"+today.getDate()+" "+today.getHours()+":"+ today.getMinutes();
					
					console.log('FinishGetData');
			},
			updateDocument: function(msg){
				console.log('updateDocument');				
				//$('.add_new_contact').trigger('click');
				//console.log('click1');				
				//ждем 2 секунды и нажимаем сохранить на сделке
				//setTimeout(function(){
				//console.log('click2');				
				$('.card-top-save-button').removeClass('button-input-disabled').trigger('click');					
				//}, 500);
			},
			updateDoc2: function(msg){				
				$('.note-edit__actions__submit').removeClass('button-input-disabled').trigger('click');				
			}	
			
		};
		return this;
    };


return CustomWidget;
});