import{_ as a,o as e,c as i,j as n,a as s}from"./chunks/framework.yMGLHqpH.js";const f=JSON.parse('{"title":"遊戲路由","description":"","frontmatter":{"title":"遊戲路由"},"headers":[],"relativePath":"zh-TW/manual/configuration/gaming-oriented-routing.md","filePath":"zh-TW/manual/configuration/gaming-oriented-routing.md"}'),p={name:"zh-TW/manual/configuration/gaming-oriented-routing.md"};function t(o,l,c,u,r,g){return e(),i("div",null,[...l[0]||(l[0]=[n("div",{class:"info custom-block"},[n("p",{class:"custom-block-title"},"INFO"),n("p",null,[s("來源："),n("a",{href:"https://github.com/daeuniverse/dae/blob/5db27a0028d36e7847bd3796497df952337a20e2/docs/en/configuration/gaming-oriented-routing.md",target:"_blank",rel:"noreferrer"},"dae 上游文件"),s(" · "),n("a",{href:"/repo-for-linux/upstream/dae-LICENSE.txt"},"AGPL-3.0 授權條款"),s("。")])],-1),n("div",{lang:"zh-TW"},[n("h1",{id:"遊戲路由",tabindex:"-1"},[s("遊戲路由 "),n("a",{class:"header-anchor",href:"#遊戲路由","aria-label":'標題連結： "遊戲路由"'},"​")]),n("p",null,"DAE 設定（例如 /etc/dae/config.dae）"),n("div",{class:"language- vp-adaptive-theme"},[n("button",{title:"複製程式碼",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[n("code",null,[n("span",{class:"line"},[n("span",null,"routing {            ")]),s(`
`),n("span",{class:"line"},[n("span",null,"#stop using low efficiency socks5 proxy or else")]),s(`
`),n("span",{class:"line"},[n("span",null,"#dscp(8) -> game             ")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"#using fw mark for ultra fast gaming experience")]),s(`
`),n("span",{class:"line"},[n("span",null,"dscp(8) -> direct(mark:0x800)")]),s(`
`),n("span",{class:"line"},[n("span",null,"}")])])])]),n("p",null,"OpenWRT 網路設定（例如 /etc/config/network）"),n("p",null,"請謹慎選擇通道 MTU（由於 UDP Ping（1300 位元組），CS2 要求 MTU > 1300）"),n("div",{class:"language- vp-adaptive-theme"},[n("button",{title:"複製程式碼",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[n("code",null,[n("span",{class:"line"},[n("span",null,"config interface 'wg100'                                                 ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option proto 'wireguard'                                         ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option private_key '[Client Private Key]'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list addresses '10.7.0.2/24'                                    ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list addresses 'fd42:42:42::2/64'                               ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option mtu '1420'                                               ")]),s(`
`),n("span",{class:"line"},[n("span",null,"                                                                        ")]),s(`
`),n("span",{class:"line"},[n("span",null,"config wireguard_wg100                                                  ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option public_key '[Server Public Key]'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option endpoint_host '[Your Server IP]'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list allowed_ips '0.0.0.0/0'  ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list allowed_ips '::/0'       ")]),s(`
`),n("span",{class:"line"},[n("span",null,"                                      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"config route                          ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option interface 'wg100'      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option target '0.0.0.0/0'     ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option gateway '10.7.0.1'     ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option table '114'            ")]),s(`
`),n("span",{class:"line"},[n("span",null,"                                      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"config route6                         ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option interface 'wg100'      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option target '::/0'          ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option gateway 'fd42:42:42::1'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option table '114'       ")]),s(`
`),n("span",{class:"line"},[n("span",null,"                                 ")]),s(`
`),n("span",{class:"line"},[n("span",null,"config rule                      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option lookup '114'      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option mark '0x800/0x800'")]),s(`
`),n("span",{class:"line"},[n("span",null,"                                 ")]),s(`
`),n("span",{class:"line"},[n("span",null,"config rule6                     ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option lookup '114'      ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option mark '0x800/0x800'")])])])]),n("p",null,"OpenWRT 防火牆設定（例如 /etc/config/firewall）"),n("div",{class:"language- vp-adaptive-theme"},[n("button",{title:"複製程式碼",class:"copy"}),n("span",{class:"lang"}),n("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[n("code",null,[n("span",{class:"line"},[n("span",null,"config nat                       ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option src 'vpn'         ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option src_ip '[Gaming PC IPv4 Address]'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option target 'SNAT'         ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option snat_ip '10.7.0.2'    ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option family 'ipv4'         ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list proto 'all'    ")]),s(`
`),n("span",{class:"line"},[n("span")]),s(`
`),n("span",{class:"line"},[n("span",null,"config nat                     ")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option src 'vpn'")]),s(`
`),n("span",{class:"line"},[n("span",null,"         option src_ip '[Gaming PC IPv6 Address]'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option target 'SNAT'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option snat_ip 'fd42:42:42::2'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        option family 'ipv6'")]),s(`
`),n("span",{class:"line"},[n("span",null,"        list proto 'all'")])])])])],-1)])])}const m=a(p,[["render",t]]);export{f as __pageData,m as default};
