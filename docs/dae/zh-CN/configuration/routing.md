---
title: "路由规则"
---

<div v-pre lang="zh-CN">

# 路由规则

## 示例

### 内置出站

```shell
### Built-in outbounds: block, direct, must_rules

# must_rules means no redirecting DNS traffic to dae and continue to matching.
# For single rule, the difference between "direct" and "must_direct" is that "direct" will hijack and process DNS request
# (for traffic split use), but "must_direct" will not. "must_direct" is useful when there are traffic loops of DNS requests.
# "must_direct" can also be written as "direct(must)".
# Similarly, "must_groupname" is also supported to NOT hijack and process DNS traffic, which equals to "groupname(must)".
```

### 默认出站

```shell
### fallback outbound
# If no rule matches, traffic will go through the outbound defined by fallback.
fallback: my_group
```

### 域名规则

```shell
### Domain rule
domain(suffix: v2raya.org) -> my_group  # equals to domain(v2raya.org) -> my_group 
domain(full: dns.google) -> my_group
domain(keyword: facebook) -> my_group
domain(regex: '\.goo.*\.com$') -> my_group
domain(geosite:category-ads) -> block
domain(geosite:cn)->direct
```

### 目标 IP

```shell
### Dest IP rule
dip(8.8.8.8) -> direct
dip(101.97.0.0/16) -> direct
dip(geoip:private) -> direct
```

### 来源 IP

```shell
### Source IP rule
sip(192.168.0.0/24) -> my_group
sip(192.168.50.0/24) -> direct
```

### 目标端口

```shell
### Dest port rule
dport(80) -> direct
dport(10080-30000) -> direct
```

### 来源端口

```shell
### Source port rule
sport(38563) -> direct
sport(10080-30000) -> direct
```

### 传输层协议

```shell
### Level 4 protocol rule:
l4proto(tcp) -> my_group
l4proto(udp) -> direct
```

### IP 版本

```shell
### IP version rule:
ipversion(4) -> block
ipversion(6) -> ipv6_group
```

### 来源 MAC

```shell
### Source MAC rule
mac('02:42:ac:11:00:02') -> direct
```

### 进程名称

```shell
### Process Name rule (only support localhost process when binding to WAN)
pname(curl) -> direct
```

### DSCP

```shell
### DSCP rule (match DSCP; is useful for BT bypass). See https://github.com/daeuniverse/dae/discussions/295
dscp(0x4) -> direct
```

### 多个域名

```shell
### Multiple domains rule
domain(keyword: google, suffix: www.twitter.com, suffix: v2raya.org) -> my_group
```

### 多个 IP 地址

```shell
### Multiple IP rule
dip(geoip:cn, geoip:private) -> direct
dip(9.9.9.9, 223.5.5.5) -> direct
sip(192.168.0.6, 192.168.0.10, 192.168.0.15) -> direct
```

### 与条件

```shell
### 'And' rule
dip(geoip:cn) && dport(80) -> direct
dip(8.8.8.8) && l4proto(tcp) && dport(1-1023, 8443) -> my_group
dip(1.1.1.1) && sip(10.0.0.1, 172.20.0.0/16) -> direct
```

### 非条件

```shell
### 'Not' rule
!domain(geosite:google-scholar,
        geosite:category-scholar-!cn,
        geosite:category-scholar-cn
    ) -> my_group
```

### 组合条件

```shell
### Little more complex rule
domain(geosite:geolocation-!cn) &&
    !domain(geosite:google-scholar,
            geosite:category-scholar-!cn,
            geosite:category-scholar-cn
        ) -> my_group
```

### 自定义 DAT 文件

```shell
### Customized DAT file
domain(ext:"yourdatfile.dat:yourtag")->direct
dip(ext:"yourdatfile.dat:yourtag")->direct
```

### 防火墙标记

```shell
### Set fwmark
# Mark is useful when you want to redirect traffic to specific interface (such as wireguard) or for other advanced uses.

# An example of redirecting Disney traffic to wg0 is given here.
# You need set ip rule and ip table like this:
# 1. Set all traffic with mark 0x800/0x800 to use route table 1145:
# >> ip rule add fwmark 0x800/0x800 table 1145
# >> ip -6 rule add fwmark 0x800/0x800 table 1145
# 2. Set default route of route table 1145:
# >> ip route add default dev wg0 scope global table 1145
# >> ip -6 route add default dev wg0 scope global table 1145
# Notice that interface wg0, mark 0x800, table 1145 can be set by preferences, but cannot conflict.
# Notice also that dae marks its own egress traffic with an internal mark (0x100) unless
# so_mark_from_dae sets another one: a rule written for *unmarked* traffic does not match
# dae's own egress, and a rule that matches 0x100 affects dae's own traffic as well.
# 3. Set routing rules in dae config file.
domain(geosite:disney) -> direct(mark: 0x800)
```

### Must 规则

```shell
### Must rules
# For following rules, DNS requests will be forcibly redirected to dae except from mosdns.
# Different from must_direct/must_my_group, traffic from mosdns will continue to match other rules.
pname(mosdns) -> must_rules
ip(geoip:cn) -> direct
domain(geosite:cn) -> direct
fallback: my_group
```

## 按设备限定的域名白名单（自动 sniff-punt）

```shell
mac('aa:bb:cc:dd:ee:ff') && domain(geosite:docker, suffix:quay.io, geosite:github) -> my_group
mac('aa:bb:cc:dd:ee:ff') -> direct
```

域名条件依赖域名信息，只有设备的 DNS 请求经过 dae 才能获得这些信息。如果设备使用加密 DNS（DoH/DoT），白名单原本会在没有提示的情况下失效，设备的所有流量都会落到回退规则。dae 会识别这种规则组合：单主机 `mac`/`sip` 选择器、正向 `domain` 条件，以及位于其后、仅含该选择器的 `direct`/`block` 回退规则。

dae 会在回退规则前自动插入一条仅在内核空间生效的 sniff-punt 规则：将缺少域名信息的连接送到用户空间，嗅探 TLS SNI、HTTP host 或 QUIC，再用嗅探到的域名重新匹配同一组规则。该设备未命中白名单的流量仍会落到回退规则，并经用户空间转发。使用此功能需要启用嗅探（`sniffing_timeout > 0`、`dial_mode != ip`）；可通过 `auto_sniff_punt: false` 关闭。

</div>

---

来源：[dae 上游文档](https://github.com/daeuniverse/dae/blob/1ec85feddc721088ecdda73015bd78f652926b39/docs/en/configuration/routing.md) · [AGPL-3.0 许可证](/upstream/dae-LICENSE.txt)。
