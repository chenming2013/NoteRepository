package arithmetic;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


/*
 * 这是MD5加密算法，用来对数据进行加密
 */
public class MD5_Arithmetic
{
	public final static String MD5(String s)
	{
		//十六进制
		char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};
		
		try
		{
			byte[] strTemp = s.getBytes();
			MessageDigest mdTemp = MessageDigest.getInstance("MD5");
			mdTemp.update(strTemp);
			byte[] md = mdTemp.digest();
			int j = md.length;
			char[] str = new char[j*2];
			int k = 0;
			for(int i=0;i<j;i++)
			{
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0>>>4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(str);
		} catch (NoSuchAlgorithmException e)
		{
			// TODO Auto-generated catch block
			return null;
		}
	}
}
