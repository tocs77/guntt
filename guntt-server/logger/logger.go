package logger

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/felixge/httpsnoop"
)

// HTTPReqInfo describes info about HTTP request
type HTTPReqInfo struct {
	// GET etc.
	method  string
	uri     string
	referer string
	ipaddr  string
	// response code, like 200, 404
	code int
	// number of bytes of the response sent
	size int64
	// how long did it take to
	duration  time.Duration
	userAgent string
}

//LogRequestHandler middleware function to log request data
func LogRequestHandler(h http.HandlerFunc, logChannel chan string) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) {
		ri := &HTTPReqInfo{
			method:    r.Method,
			uri:       r.URL.String(),
			referer:   r.Header.Get("Referer"),
			userAgent: r.Header.Get("User-Agent"),
		}

		ri.ipaddr = requestGetRemoteAddress(r)

		// this runs handler h and captures information about
		// HTTP request
		m := httpsnoop.CaptureMetrics(h, w, r)

		ri.code = m.Code
		ri.size = m.Written
		ri.duration = m.Duration
		logHTTPReq(ri, logChannel)
	}
	return fn
}

// Request.RemoteAddress contains port, which we want to remove i.e.:
// "[::1]:58292" => "[::1]"
func ipAddrFromRemoteAddr(s string) string {
	idx := strings.LastIndex(s, ":")
	if idx == -1 {
		return s
	}
	return s[:idx]
}

// requestGetRemoteAddress returns ip address of the client making the request,
// taking into account http proxies
func requestGetRemoteAddress(r *http.Request) string {
	hdr := r.Header
	hdrRealIP := hdr.Get("X-Real-Ip")
	hdrForwardedFor := hdr.Get("X-Forwarded-For")
	if hdrRealIP == "" && hdrForwardedFor == "" {
		return ipAddrFromRemoteAddr(r.RemoteAddr)
	}
	if hdrForwardedFor != "" {
		// X-Forwarded-For is potentially a list of addresses separated with ","
		parts := strings.Split(hdrForwardedFor, ",")
		for i, p := range parts {
			parts[i] = strings.TrimSpace(p)
		}
		// TODO: should return first non-local address
		return parts[0]
	}
	return hdrRealIP
}

func logHTTPReq(ri *HTTPReqInfo, logChannel chan string) {

	msg := fmt.Sprintf(`method %s
	uri %s
	referer %s
	ipaddr %s
	code %s
	size %s
	duration %s
	ua %s`, ri.method, ri.uri, ri.referer, ri.ipaddr,
		strconv.Itoa(ri.code), strconv.FormatInt(ri.size, 10),
		strconv.FormatInt(int64(ri.duration/time.Millisecond), 10), ri.userAgent)

	logChannel <- msg
}

//Logger function to writa all input data to log
func Logger(input chan string) {
	f, err := os.OpenFile("guntt.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()

	log.SetOutput(f)
	for entry := range input {
		log.Printf("\n%s", entry)
		log.Print("\n--------------------------------\n")
	}
}
