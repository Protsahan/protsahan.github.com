var _base, _base1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Protsahan = {
  Models: {},
  Collections: {},
  Routers: {},
  Views: {}
};

Protsahan.Models.PicasaImage = (function(_super) {

  __extends(PicasaImage, _super);

  function PicasaImage() {
    this.parse = __bind(this.parse, this);
    return PicasaImage.__super__.constructor.apply(this, arguments);
  }

  PicasaImage.prototype.paramRoot = 'picasa_image';

  PicasaImage.prototype.defaults = {
    title: null,
    thumbnail: null,
    url: null
  };

  PicasaImage.prototype.parse = function(response) {
    var attributes;
    return attributes = {
      id: response.gphoto$id.$t,
      title: response.summary.$t || response.title.$t,
      thumbnail: response.media$group.media$thumbnail[0].url,
      url: response.content.src
    };
  };

  return PicasaImage;

})(Backbone.Model);

Protsahan.Collections.PicasaImagesCollection = (function(_super) {

  __extends(PicasaImagesCollection, _super);

  function PicasaImagesCollection() {
    this.parse = __bind(this.parse, this);

    this.url = __bind(this.url, this);

    this.initialize = __bind(this.initialize, this);
    return PicasaImagesCollection.__super__.constructor.apply(this, arguments);
  }

  PicasaImagesCollection.prototype.model = Protsahan.Models.PicasaImage;

  PicasaImagesCollection.prototype.initialize = function(models, options) {
    this.user = options.user;
    return this.album = options.album;
  };

  PicasaImagesCollection.prototype.url = function() {
    var base_url, params;
    base_url = "https://picasaweb.google.com/data/feed/api/user/" + this.user + "/album/" + this.album;
    params = {
      kind: 'photo',
      access: 'public',
      'max-results': 30,
      'start-index': 1,
      thumbsize: '160c',
      imgmax: 'd',
      alt: 'json-in-script'
    };
    return "" + base_url + "?" + ($.param(params)) + "&callback=?";
  };

  PicasaImagesCollection.prototype.parse = function(response) {
    return response.feed.entry;
  };

  return PicasaImagesCollection;

})(Backbone.Collection);

(_base = Protsahan.Views).PicasaImages || (_base.PicasaImages = {});

Protsahan.Views.PicasaImages.IndexView = (function(_super) {

  __extends(IndexView, _super);

  function IndexView() {
    this.render = __bind(this.render, this);

    this.addOne = __bind(this.addOne, this);

    this.addAll = __bind(this.addAll, this);
    return IndexView.__super__.constructor.apply(this, arguments);
  }

  IndexView.prototype.tagName = 'p';

  IndexView.prototype.initialize = function() {
    return this.options.picasa_images.bind('reset', this.addAll);
  };

  IndexView.prototype.addAll = function() {
    return this.options.picasa_images.each(this.addOne);
  };

  IndexView.prototype.addOne = function(picasa_image) {
    var view;
    view = new Protsahan.Views.PicasaImages.PicasaImageView({
      model: picasa_image
    });
    return $(this.el).append(view.render().el);
  };

  IndexView.prototype.render = function() {
    $(this.el).attr({
      'data-toggle': 'modal-gallery',
      'data-target': '#modal-gallery'
    });
    this.addAll();
    return this;
  };

  return IndexView;

})(Backbone.View);

(_base1 = Protsahan.Views).PicasaImages || (_base1.PicasaImages = {});

Protsahan.Views.PicasaImages.PicasaImageView = (function(_super) {

  __extends(PicasaImageView, _super);

  function PicasaImageView() {
    this.render = __bind(this.render, this);
    return PicasaImageView.__super__.constructor.apply(this, arguments);
  }

  PicasaImageView.prototype.tagName = 'a';

  PicasaImageView.prototype.render = function() {
    $(this.el).attr({
      rel: 'gallery',
      href: this.model.get('url'),
      title: this.model.get('title')
    });
    $(this.el).html("<img src='" + (this.model.get('thumbnail')) + "' alt='" + (this.model.get('title')) + "' />");
    return this;
  };

  return PicasaImageView;

})(Backbone.View);

Protsahan.Routers.PicasaImagesRouter = (function(_super) {

  __extends(PicasaImagesRouter, _super);

  function PicasaImagesRouter() {
    return PicasaImagesRouter.__super__.constructor.apply(this, arguments);
  }

  PicasaImagesRouter.prototype.initialize = function(options) {
    this.picasa_images = new Protsahan.Collections.PicasaImagesCollection([], {
      user: '110278106735349479057',
      album: 'Pictures'
    });
    return this.picasa_images.fetch();
  };

  PicasaImagesRouter.prototype.routes = {
    "index": "index",
    ":id": "show",
    ".*": "index"
  };

  PicasaImagesRouter.prototype.index = function() {
    this.view = new Protsahan.Views.PicasaImages.IndexView({
      picasa_images: this.picasa_images
    });
    return $(".content").html(this.view.render().el);
  };

  PicasaImagesRouter.prototype.show = function(id) {
    var picasa_image;
    picasa_image = this.picasa_images.get(id);
    this.view = new Protsahan.Views.PicasaImages.ShowView({
      model: picasa_image
    });
    return $(".content").html(this.view.render().el);
  };

  return PicasaImagesRouter;

})(Backbone.Router);

