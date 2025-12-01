package api

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gotify/server/v2/auth"
	"github.com/gotify/server/v2/model"
	"github.com/gotify/server/v2/i18n"
)

// The Database interface for the application admin API
type ApplicationAdminDatabase interface {
	ApplicationDatabase
	GetUserByID(id uint) (*model.User, error)
}

// CreateApplicationForUser creates an application for a specific user.
// swagger:operation POST /application/admin application createAppForUser
//
// Create an application for a user (admin only).
//
//	---
//	consumes: [application/json]
//	produces: [application/json]
//	security: [clientTokenAuthorizationHeader: [], clientTokenHeader: [], clientTokenQuery: [], basicAuth: []]
//	parameters:
//	- name: body
//	  in: body
//	  description: the application to add and the target user
//	  required: true
//	  schema:
//	    $ref: "#/definitions/ApplicationForUserParams"
//	responses:
//	  200:
//	    description: Ok
//	    schema:
//	        $ref: "#/definitions/Application"
//	  400:
//	    description: Bad Request
//	    schema:
//	        $ref: "#/definitions/Error"
//	  401:
//	    description: Unauthorized
//	    schema:
//	        $ref: "#/definitions/Error"
//	  403:
//	    description: Forbidden (not admin)
//	    schema:
//	        $ref: "#/definitions/Error"
//	  404:
//	    description: User Not Found
//	    schema:
//	        $ref: "#/definitions/Error"
func (a *ApplicationAPI) CreateApplicationForUser(ctx *gin.Context) {
	params := ApplicationForUserParams{}
	if err := ctx.Bind(&params); err != nil {
		// 返回错误响应
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// 验证用户是否存在
	userDB, ok := a.DB.(ApplicationAdminDatabase)
	if !ok {
		ctx.AbortWithError(http.StatusInternalServerError, errors.New("database does not implement GetUserByID"))
		return
	}

	user, err := userDB.GetUserByID(params.UserID)
	if err != nil {
		// 数据库错误
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	if user == nil {
		// 用户不存在
		lang := i18n.GetLangFromContext(ctx)
		ctx.AbortWithError(http.StatusNotFound,
			errors.New(i18n.T(lang, "user_not_found")))
		return
	}

	app := model.Application{
		Name:            params.Name,
		Description:     params.Description,
		DefaultPriority: params.DefaultPriority,
		Token:           auth.GenerateNotExistingToken(generateApplicationToken, a.applicationExists),
		UserID:          params.UserID, // 使用指定的用户ID
		Internal:        false,
	}

	if success := successOrAbort(ctx, 500, a.DB.CreateApplication(&app)); !success {
		return
	}

	// 翻译成功消息
	lang := i18n.GetLangFromContext(ctx)
	ctx.JSON(200, gin.H{
		"application": withResolvedImage(&app),
		"message": i18n.T(lang, "created_app_successfully"),
	})
}

// ApplicationForUserParams defines parameters for creating an application for a specific user
//
// swagger:model ApplicationForUserParams
type ApplicationForUserParams struct {
	// The ID of the user for whom the application will be created
	//
	// required: true
	// example: 2
	UserID uint `json:"user_id" binding:"required"`
	// The application name. This is how the application should be displayed to the user.
	//
	// required: true
	// example: Backup Server
	Name string `json:"name" binding:"required"`
	// The description of the application.
	//
	// example: Backup server for the interwebs
	Description string `json:"description"`
	// The default priority of messages sent by this application. Defaults to 0.
	//
	// example: 5
	DefaultPriority int `json:"default_priority"`
}