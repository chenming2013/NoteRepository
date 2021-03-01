package com.web1.identifyCode;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
	该程序是生成7位验证码Servlet
 */
public class CreateCode extends HttpServlet
{
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		
		//7.禁止浏览器缓存图片
		response.setDateHeader("Expires", -1);
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		
		
		//6.通知客户端以图片方式打开发送过去的数据
		response.setHeader("Content-Type", "image/jpeg");
			
		
		//1.在内存中创建一副图片
		BufferedImage image = new BufferedImage(80, 30, BufferedImage.TYPE_INT_RGB);
		
		
		//2.得到画笔，向图片上写数据
		Graphics g = image.getGraphics();
		
		
		//设背景色
		g.setColor(Color.white);
		//绘制一个矩形
		g.fillRect(0, 0, 80, 30);
		
		//3.设置写入数据的颜色和字体
		g.setColor(Color.BLACK);
		g.setFont(new Font(null,Font.BOLD,20));
		
		
		//4.得到一个随机数
		String num = makeNum();
		//把随即生成的数值保存在session
		request.getSession().setAttribute("identifyCode", num);
		g.drawString(num, 0, 20);
		
		
		//5.把写好数据的图片输出给浏览器
		ImageIO.write(image, "jpg", response.getOutputStream());
	}
	
	//该函数是产生图片中的随机数(7位)
	public String makeNum()
	{
		Random r =  new Random();
		//随即产生7位数
		String num = r.nextInt(9999999) + "";
		StringBuffer sb = new StringBuffer();
		//这个for循环是为了防止随即产生的num不够7位
		//若是不够七位就补0
		for(int i=0;i<7-num.length();i++)
		{
			sb.append("0");
		}
		//若是产生的随机数不够七位，就在前面补0
		num = sb.toString() + num;
		return num;
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException
	{
		this.doGet(request, response);
	}
}
