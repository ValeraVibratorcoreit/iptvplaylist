(function () {
    'use strict';
    
    var manifest = {
        type: 'video',
        version: '1.0.0',
        name: 'Valeraq',
        description: 'Плагин Valeraq для Lampa 3.0.4',
        component: 'valeraq',
    };
    
    Lampa.Manifest.plugins = Lampa.Manifest.plugins.concat([manifest]);
    
    var templates = {
        content: '<div class="valeraq-main">'+
            '<div class="valeraq-content">'+
                '<div class="valeraq-header">'+
                    '<h2 class="valeraq-title">Valeraq</h2>'+
                    '<div class="valeraq-subtitle">Ваш персональный раздел</div>'+
                '</div>'+
                '<div class="valeraq-items">'+
                    '<div class="items-line">'+
                        '<div class="items-line__title">Категории</div>'+
                        '<div class="items-line__body">'+
                            '<div class="valeraq-cards">'+
                                '<div class="card selector valeraq-card" data-id="1">'+
                                    '<div class="card__img"></div>'+
                                    '<div class="card__title">Фильмы</div>'+
                                '</div>'+
                                '<div class="card selector valeraq-card" data-id="2">'+
                                    '<div class="card__img"></div>'+
                                    '<div class="card__title">Сериалы</div>'+
                                '</div>'+
                                '<div class="card selector valeraq-card" data-id="3">'+
                                    '<div class="card__img"></div>'+
                                    '<div class="card__title">Мультфильмы</div>'+
                                '</div>'+
                                '<div class="card selector valeraq-card" data-id="4">'+
                                    '<div class="card__img"></div>'+
                                    '<div class="card__title">Аниме</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
        
        css: '<style>'+
            '.valeraq-main { padding: 1.5em; min-height: 100vh; }'+
            '.valeraq-content { max-width: 1400px; margin: 0 auto; }'+
            '.valeraq-header { margin-bottom: 2em; }'+
            '.valeraq-title { color: #fff; font-size: 2.5em; font-weight: 300; margin-bottom: 0.2em; }'+
            '.valeraq-subtitle { color: rgba(255,255,255,0.5); font-size: 1.1em; }'+
            '.items-line { margin-bottom: 2em; }'+
            '.items-line__title { color: #fff; font-size: 1.4em; margin-bottom: 1em; font-weight: 400; }'+
            '.valeraq-cards { display: flex; gap: 1em; flex-wrap: wrap; }'+
            '.valeraq-card { background: rgba(255,255,255,0.08); border-radius: 0.4em; padding: 1em; min-width: 140px; cursor: pointer; transition: all 0.3s; }'+
            '.valeraq-card:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }'+
            '.valeraq-card.focus { background: rgba(255,255,255,0.2); transform: scale(1.05); }'+
            '.valeraq-card .card__img { width: 120px; height: 170px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.3em; margin: 0 auto 0.8em; }'+
            '.valeraq-card .card__title { color: #fff; text-align: center; font-size: 0.95em; }'+
        '</style>'
    };
    
    function component(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({mask: true, over: true, step: 250});
        var items = [];
        var html = $('<div></div>');
        var body = $('<div class="category-full"></div>');
        var active = 0;
        var info;
        
        this.create = function () {
            var _this = this;
            
            this.activity.loader(true);
            
            // Добавляем CSS если его еще нет
            if (!$('#valeraq-styles').length) {
                $('head').append($(templates.css).attr('id', 'valeraq-styles'));
            }
            
            var content_html = $(templates.content);
            
            // Находим карточки
            items = content_html.find('.valeraq-card');
            
            // Добавляем обработчики
            items.each(function(index) {
                var card = $(this);
                
                card.on('hover:focus', function () {
                    active = index;
                    scroll.update(card[0]);
                }).on('hover:enter', function () {
                    var title = card.find('.card__title').text();
                    Lampa.Noty.show('Вы выбрали: ' + title);
                    
                    // Здесь можно добавить переход к контенту
                    /*
                    Lampa.Activity.push({
                        url: '',
                        title: title,
                        component: 'category',
                        category: title.toLowerCase(),
                        page: 1
                    });
                    */
                });
            });
            
            body.append(content_html);
            scroll.append(body);
            
            html.append(scroll.render());
            
            this.activity.loader(false);
            
            this.activity.toggle();
        };
        
        this.start = function () {
            var _this = this;
            
            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(scroll.render());
                    Lampa.Controller.collectionFocus(items[active], scroll.render());
                },
                left: function () {
                    if (Lampa.Navigator.canmove('left')) Lampa.Navigator.move('left');
                    else Lampa.Controller.toggle('menu');
                },
                right: function () {
                    if (Lampa.Navigator.canmove('right')) Lampa.Navigator.move('right');
                },
                up: function () {
                    if (Lampa.Navigator.canmove('up')) Lampa.Navigator.move('up');
                    else Lampa.Controller.toggle('head');
                },
                down: function () {
                    if (Lampa.Navigator.canmove('down')) Lampa.Navigator.move('down');
                },
                back: function () {
                    Lampa.Activity.backward();
                }
            });
            
            Lampa.Controller.toggle('content');
        };
        
        this.pause = function () {
            
        };
        
        this.stop = function () {
            
        };
        
        this.render = function () {
            return html;
        };
        
        this.destroy = function () {
            network.clear();
            Lampa.Arrays.destroy(items);
            scroll.destroy();
            html.remove();
            body.remove();
        };
    }
    
    function startPlugin() {
        window.plugin_valeraq_ready = true;
        
        Lampa.Component.add('valeraq', component);
        
        function addButton() {
            var ico = '<svg height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">'+
                '<rect x="2" y="8" width="34" height="21" rx="3" fill="white"/>'+
                '<rect x="7" y="12" width="24" height="4" rx="1" fill="black" opacity="0.3"/>'+
                '<rect x="7" y="19" width="17" height="3" rx="1" fill="black" opacity="0.3"/>'+
                '<rect x="7" y="24" width="20" height="2" rx="1" fill="black" opacity="0.3"/>'+
                '<circle cx="30" cy="13" r="6" fill="#FF4444"/>'+
                '</svg>';
            
            var button = $('<li class="menu__item selector" data-action="valeraq">'+
                '<div class="menu__ico">'+ico+'</div>'+
                '<div class="menu__text">Valeraq</div>'+
            '</li>');
            
            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Valeraq',
                    component: 'valeraq',
                    page: 1
                });
            });
            
            var menu = $('.menu .menu__list').eq(0);
            
            if (menu.find('[data-action="valeraq"]').length == 0) {
                var before = menu.find('[data-action="catalog"], [data-action="filter"], [data-action="collections"]').eq(0);
                
                if (before.length) {
                    before.after(button);
                } else {
                    menu.append(button);
                }
            }
        }
        
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                addButton();
            }
        });
        
        if (window.appready || (Lampa.Activity && Lampa.Activity.active && Lampa.Activity.active())) {
            addButton();
        }
    }
    
    if (!window.plugin_valeraq_ready) startPlugin();
    
})();