package i18n

import (
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/locales/en"
	"github.com/go-playground/locales/zh"
	"github.com/go-playground/locales/zh_Hant"
	"github.com/go-playground/universal-translator"
)

// 翻译器
var (
	uni      *ut.UniversalTranslator
	translators map[string]ut.Translator
)

// 初始化翻译器
func InitI18n() {
	// 定义支持的语言
	enLocale := en.New()
	zhLocale := zh.New()
	zhHantLocale := zh_Hant.New()

	uni = ut.New(enLocale, zhLocale, zhHantLocale)

	// 获取各种语言的翻译器
	enTrans, _ := uni.GetTranslator("en")
	zhTrans, _ := uni.GetTranslator("zh")
	zhHantTrans, _ := uni.GetTranslator("zh-Hant")

	translators = make(map[string]ut.Translator)
	translators["en"] = enTrans
	translators["zh"] = zhTrans
	translators["zh-Hant"] = zhHantTrans

	// 注册默认翻译
	registerDefaultTranslations(enTrans, "en")
	registerDefaultTranslations(zhTrans, "zh")
	registerDefaultTranslations(zhHantTrans, "zh-Hant")
}

// 获取翻译器
func GetTranslator(lang string) ut.Translator {
	// 标准化语言代码
	lang = normalizeLangCode(lang)
	
	if trans, exists := translators[lang]; exists {
		return trans
	}
	
	// 如果没找到对应的翻译器，返回默认的英文翻译器
	return translators["en"]
}

// 从Gin上下文获取语言
func GetLangFromContext(c *gin.Context) string {
	lang := c.GetHeader("Accept-Language")
	if lang == "" {
		lang = c.Query("lang")
	}
	if lang == "" {
		lang = "en" // 默认语言
	}
	return normalizeLangCode(lang)
}

// 翻译函数
func T(lang string, key string, args ...interface{}) string {
	trans := GetTranslator(lang)

	if len(args) == 0 {
		result, _ := trans.T(key)
		return result
	}

	// 不带参数的翻译作为默认实现，因为参数处理较复杂
	// 在实际的应用中可以使用更复杂的参数处理
	return key
}

// 获取当前上下文的翻译
func TWithContext(c *gin.Context, key string, args ...interface{}) string {
	lang := GetLangFromContext(c)
	return T(lang, key, args...)
}

// 标准化语言代码
func normalizeLangCode(lang string) string {
	// 将语言代码转换为小写，并规范化格式
	result := ""
	for i, r := range lang {
		if unicode.IsUpper(r) {
			if i > 0 {
				result += string(unicode.ToLower(r))
			} else {
				result += string(r)
			}
		} else if r == '-' {
			result += "_"
		} else {
			result += string(r)
		}
	}
	
	// 处理特殊情况，如 zh-CN -> zh
	if result == "zh_CN" {
		result = "zh"
	} else if result == "zh_TW" {
		result = "zh_Hant"
	}
	
	return result
}

// 注册默认翻译
func registerDefaultTranslations(trans ut.Translator, lang string) {
	// 根据语言注册默认翻译项
	defaultTranslations := getDefaultTranslations(lang)
	
	for key, value := range defaultTranslations {
		_ = trans.Add(key, value, false)
	}
}

// 获取默认翻译
func getDefaultTranslations(lang string) map[string]string {
	translations := make(map[string]string)
	
	switch lang {
	case "zh":
		translations["created_app_successfully"] = "应用创建成功"
		translations["invalid_parameters"] = "参数无效"
		translations["user_not_found"] = "用户不存在"
		translations["unauthorized"] = "未授权访问"
		translations["created_by_admin"] = "由管理员创建"
	case "en":
		translations["created_app_successfully"] = "App created successfully"
		translations["invalid_parameters"] = "Invalid parameters"
		translations["user_not_found"] = "User not found"
		translations["unauthorized"] = "Unauthorized access"
		translations["created_by_admin"] = "Created by admin"
	case "zh_Hant":
		translations["created_app_successfully"] = "應用創建成功"
		translations["invalid_parameters"] = "參數無效"
		translations["user_not_found"] = "用戶不存在"
		translations["unauthorized"] = "未授權訪問"
		translations["created_by_admin"] = "由管理員創建"
	}
	
	return translations
}