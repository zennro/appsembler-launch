$(function(){
    var API_ROOT = '/api/v1/';

    // Models
    var Project = Backbone.Model.extend({});

    var ProjectList = Backbone.Collection.extend({
        model: Project,
        url: API_ROOT + 'projects/',
        parse: function(response) {
            return response.objects;
        }
    });

    var Deployment = Backbone.Model.extend({
        url: API_ROOT + 'deployments/'
    });

    // Views
    var AppView = Backbone.View.extend({
        el: $('.container'),

        events: {
            "submit form.form-deploy": "deploy"
        },

        initialize: function() {
            this.projects = new ProjectList();
            var _this = this;
            this.projects.fetch().complete(function() {
                _this.render();
            });

        },

        render: function() {
            var template = _.template($("#project_form_template").html(), {
                projects: this.projects.toJSON()
            });
            this.$el.html(template);
            return this;
        },

        deploy: function(e) {
            $("#info-message").show();
            var project_uri = this.$('select[name=project]').val();
            var email = this.$('input[name=email]').val();
            var deploy = new Deployment({
                project: project_uri,
                email: email
            });
            deploy.save({}, {
                success: this.deploymentSuccess,
                error: this.deploymentFail
            });
            e.preventDefault();
        },

        deploymentSuccess: function(model, response, options) {
            var $info = $("#info-message");
            $info.removeClass('alert-info').addClass('alert-success');
            $info.html('<i class="icon-ok"></i> Your deployment was successful!');
            var app_link = '<a class="app-url" href="' + model.get('url') + '">' + model.get('url') + '</a>';
            $(app_link).insertAfter($info);
        },

        deploymentFail: function(model, xhr, options) {
            var $info = $("#info-message");
            $info.removeClass('alert-info').addClass('alert-error');
            $info.html('<i class="icon-remove"></i> An error occurred!');
        }
    });

    var appview = new AppView();

});